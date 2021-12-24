const gulp = require(`gulp`);
const path = require(`path`);
const replace = require(`gulp-replace`);
const exec = require(`child_process`).execSync;

const bundle = () => {
  const cmd = [];
  cmd.push(`npm run generate${process.env.npm_lifecycle_event}`);
  exec(cmd.join(` && `));
  return gulp
    .src([`${path.resolve(__dirname, `.bundle/**/*`)}`])
    .pipe(replace(`/nuxt/`, `nuxt/`))
    .pipe(gulp.dest(`${path.resolve(__dirname, `.bundle/`)}`));
};

const create = (done) => {
  const cmd = [];
  cmd.push(`cordova create ${path.resolve(__dirname, `.cordova`)} jp.memotea Memotea`);
  cmd.push(`cd ${path.resolve(__dirname, `.cordova`)}`);
  cmd.push(`rd /s /q www`);
  cmd.push(`md www`);
  cmd.push(`xcopy ` +
    `"${path.resolve(__dirname, `.bundle/*`)}" "${path.resolve(__dirname, `.cordova/www`)}" /e`);
  cmd.push(`cordova platform add android`);
  cmd.push(`cordova plugin add cordova-plugin-file`);
  cmd.push(`cordova plugin add cordova-plugin-splashscreen`);
  cmd.push(`cordova plugin add cordova-plugin-local-notification`);
  cmd.push(`cordova plugin add cordova-plugin-admob-free ` +
    `--save --variable ADMOB_APP_ID="<YOUR_ADMOB_APP_ID_AS_FOUND_IN_ADMOB>"`);
  cmd.push(`copy "${path.resolve(__dirname, `build/cordova/config.xml`)}" ` +
    `"${path.resolve(__dirname, `.cordova/config.xml`)}"`);
  cmd.push(`copy "${path.resolve(__dirname, `build/cordova/memotea.keystore`)}" ` +
    `"${path.resolve(__dirname, `.cordova/memotea.keystore`)}"`);
  [`hdpi`, `ldpi`, `mdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`].forEach((type) => {
    cmd.push(`copy "${path.resolve(__dirname, `src/assets/image/logo.png`)}" ` +
      `"${path.resolve(__dirname, `.cordova/platforms/android/app/src/main/res/` +
      `mipmap-${type}/ic_launcher.png`)}"`);
    cmd.push(`copy "${path.resolve(__dirname, `src/assets/image/logo!.png`)}" ` +
      `"${path.resolve(__dirname, `.cordova/platforms/android/app/src/main/res/` +
      `mipmap-${type}-v26/ic_launcher_foreground.png`)}"`);
    cmd.push(`copy "${path.resolve(__dirname, `src/assets/image/back.png`)}" ` +
      `"${path.resolve(__dirname, `.cordova/platforms/android/app/src/main/res/` +
      `mipmap-${type}-v26/ic_launcher_background.png`)}"`);
    cmd.push(`copy "${path.resolve(__dirname, `src/assets/image/splash.png`)}" ` +
      `"${path.resolve(__dirname, `.cordova/platforms/android/app/src/main/res/` +
      `drawable-port-${type}/screen.png`)}"`);
  });
  exec(cmd.join(` && `));
  done();
};

const build = (done) => {
  const cmd = [];
  cmd.push(`cd ${path.resolve(__dirname, `.cordova`)}`);
  cmd.push(`cordova build --release`);
  cmd.push(`jarsigner -verbose -tsa http://timestamp.digicert.com ` +
    `-sigalg SHA1withRSA -digestalg SHA1 -keystore memotea.keystore ` +
    `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ` +
    `memotea -storepass super5334`);
  cmd.push(`zipalign -f -v 4 ` +
    `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk memotea.apk`);
  cmd.push(`apksigner sign --ks memotea.keystore --v1-signing-enabled=true ` +
    `--v2-signing-enabled=true --ks-pass pass:super5334 memotea.apk`);
  exec(cmd.join(` && `));
  done();
};

const firebase = (done) => {
  const cmd = [];
  cmd.push(`md .firebase`);
  cmd.push(`cd ${path.resolve(__dirname, `.firebase`)}`);
  cmd.push(`md bundle`);
  cmd.push(`xcopy "${path.resolve(__dirname, `build/firebase/*`)}" ` +
    `"${path.resolve(__dirname, `.firebase`)}" /e`);
  cmd.push(`xcopy "${path.resolve(__dirname, `.bundle/*`)}" ` +
    `"${path.resolve(__dirname, `.firebase/bundle`)}" /e`);
  cmd.push(`firebase deploy`);
  exec(cmd.join(` && `));
  done();
};

gulp.task(`default`, (() => {
  if (process.env.npm_lifecycle_event === `app`) {
    return gulp.series(bundle, create, build);
  } else if (process.env.npm_lifecycle_event === `web`) {
    return gulp.series(bundle, firebase);
  }
  return null;
})());
