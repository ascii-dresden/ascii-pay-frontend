{
  lib,
  stdenv,
  fetchYarnDeps,
  yarnConfigHook,
  yarnBuildHook,
  nodejs,
  iproute2,
  ascii-pay-server,
  src,
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "ascii-pay-frontend";
  version = "0.0.1";

  inherit src;

  yarnOfflineCache = fetchYarnDeps {
    yarnLock = "${finalAttrs.src}/yarn.lock";
    hash = "sha256-n/5Q/1446+P6yEmx5pGpFauxI+7vWe6kyOrQrMwGTfU="; 
  };

  nativeBuildInputs = [
    yarnConfigHook
    yarnBuildHook
    nodejs
    iproute2
  ];

  buildInputs = [ ascii-pay-server ];

  # yarnBuildHook runs `yarn --offline build` by default (yarnBuildScript = "build")

  installPhase = ''
    runHook preInstall
    mv dist $out
    runHook postInstall
  '';
})
