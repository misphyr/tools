// utils/ssh.ts
// Gera pares de chaves SSH no navegador (Web Crypto) e serializa no formato OpenSSH

export type SshAlgorithm = 'ed25519' | 'rsa-2048' | 'rsa-3072' | 'rsa-4096';

export interface SshKeyPair {
  publicKey: string;
  privateKey: string;
  fingerprint: string;
  fileName: string;
}

const textEncoder = new TextEncoder();

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
};

const base64UrlToBytes = (value: string): Uint8Array => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
};

const concatBytes = (...parts: Uint8Array[]): Uint8Array => {
  const result = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.length;
  });
  return result;
};

const uint32 = (value: number): Uint8Array => {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value);
  return bytes;
};

const sshString = (data: Uint8Array | string): Uint8Array => {
  const bytes = typeof data === 'string' ? textEncoder.encode(data) : data;
  return concatBytes(uint32(bytes.length), bytes);
};

// mpint: inteiro big-endian sem zeros à esquerda, com 0x00 extra se o bit alto estiver ligado
const sshMpint = (bytes: Uint8Array): Uint8Array => {
  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0) start++;
  let trimmed = bytes.subarray(start);
  if (trimmed[0] & 0x80) trimmed = concatBytes(new Uint8Array([0]), trimmed);
  return sshString(trimmed);
};

const wrapPem = (label: string, data: Uint8Array): string => {
  const lines = bytesToBase64(data).match(/.{1,70}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`;
};

// Formato openssh-key-v1 sem criptografia (o usuário pode adicionar senha com ssh-keygen -p)
const buildOpenSshPrivateKey = (publicBlob: Uint8Array, privateFields: Uint8Array, comment: string): string => {
  const checkInt = crypto.getRandomValues(new Uint32Array(1))[0];
  let privateSection = concatBytes(uint32(checkInt), uint32(checkInt), privateFields, sshString(comment));
  const padding: number[] = [];
  for (let i = 1; (privateSection.length + padding.length) % 8 !== 0; i++) padding.push(i);
  privateSection = concatBytes(privateSection, new Uint8Array(padding));

  const body = concatBytes(
    textEncoder.encode('openssh-key-v1\0'),
    sshString('none'),
    sshString('none'),
    sshString(''),
    uint32(1),
    sshString(publicBlob),
    sshString(privateSection),
  );
  return wrapPem('OPENSSH PRIVATE KEY', body);
};

const fingerprintOf = async (publicBlob: Uint8Array): Promise<string> => {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', publicBlob as BufferSource));
  return `SHA256:${bytesToBase64(digest).replace(/=+$/, '')}`;
};

const generateEd25519 = async (comment: string): Promise<SshKeyPair> => {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']) as CryptoKeyPair;
  const jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
  const seed = base64UrlToBytes(jwk.d!);
  const publicBytes = base64UrlToBytes(jwk.x!);

  const keyType = 'ssh-ed25519';
  const publicBlob = concatBytes(sshString(keyType), sshString(publicBytes));
  const privateFields = concatBytes(
    sshString(keyType),
    sshString(publicBytes),
    sshString(concatBytes(seed, publicBytes)),
  );

  return {
    publicKey: `${keyType} ${bytesToBase64(publicBlob)}${comment ? ` ${comment}` : ''}`,
    privateKey: buildOpenSshPrivateKey(publicBlob, privateFields, comment),
    fingerprint: await fingerprintOf(publicBlob),
    fileName: 'id_ed25519',
  };
};

const generateRsa = async (bits: number, comment: string): Promise<SshKeyPair> => {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  );
  const jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
  const [n, e, d, p, q, qi] = [jwk.n, jwk.e, jwk.d, jwk.p, jwk.q, jwk.qi].map((field) => base64UrlToBytes(field!));

  const keyType = 'ssh-rsa';
  const publicBlob = concatBytes(sshString(keyType), sshMpint(e), sshMpint(n));
  const privateFields = concatBytes(
    sshString(keyType),
    sshMpint(n),
    sshMpint(e),
    sshMpint(d),
    sshMpint(qi),
    sshMpint(p),
    sshMpint(q),
  );

  return {
    publicKey: `${keyType} ${bytesToBase64(publicBlob)}${comment ? ` ${comment}` : ''}`,
    privateKey: buildOpenSshPrivateKey(publicBlob, privateFields, comment),
    fingerprint: await fingerprintOf(publicBlob),
    fileName: 'id_rsa',
  };
};

export const generateSshKeyPair = (algorithm: SshAlgorithm, comment: string): Promise<SshKeyPair> => {
  const cleanComment = comment.trim();
  if (algorithm === 'ed25519') return generateEd25519(cleanComment);
  return generateRsa(Number(algorithm.split('-')[1]), cleanComment);
};
