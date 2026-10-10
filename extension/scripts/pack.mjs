import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const iconSizes = [16, 32, 48, 128];

// Painel lateral: side_panel no Chrome, sidebar_action no Firefox
const chromeSettings = {
  permissions: ['sidePanel'],
  side_panel: { default_path: 'panel.html' },
};

const firefoxSettings = {
  sidebar_action: {
    default_panel: 'panel.html',
    default_title: 'misphyr.tools',
    default_icon: { 16: 'icons/16.png', 32: 'icons/32.png' },
    open_at_install: false,
  },
  browser_specific_settings: {
    gecko: {
      id: 'tools@misphyr.com',
      strict_min_version: '140.0',
      data_collection_permissions: { required: ['none'] },
    },
    gecko_android: {
      strict_min_version: '142.0',
    },
  },
};

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

const writeManifest = (dir, manifest) => writeFile(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

export async function packExtension(extensionRoot) {
  const chromeDir = join(extensionRoot, 'dist/chrome');
  const firefoxDir = join(extensionRoot, 'dist/firefox');
  const { version } = await readJson(join(extensionRoot, 'package.json'));
  const manifest = { ...(await readJson(join(extensionRoot, 'manifest.base.json'))), version };

  const iconSvg = await readFile(join(extensionRoot, 'icons/icon.svg'));
  await mkdir(join(chromeDir, 'icons'), { recursive: true });
  await Promise.all(iconSizes.map((size) => sharp(iconSvg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(join(chromeDir, `icons/${size}.png`))));

  await writeManifest(chromeDir, { ...manifest, ...chromeSettings });

  await rm(firefoxDir, { recursive: true, force: true });
  await cp(chromeDir, firefoxDir, { recursive: true });
  await writeManifest(firefoxDir, { ...manifest, ...firefoxSettings });
}
