{ mkYarnPackage, ascii-pay-server, yarn, iproute, src }:

mkYarnPackage {
  name = "ascii-pay-frontend";
  version = "0.0.1";

  inherit src;

  buildInputs = [ ascii-pay-server ] ++ [ yarn iproute ];

  # yarn build wants to create a .cache dir in the node_modules folder, which fails with the standard yarn2nix directory management
  # use a simplistic alternative
  configurePhase = "cp -r $node_modules node_modules && chmod +w node_modules";
  buildPhase = ''yarn build'';
  installPhase = ''mv dist $out'';
  distPhase = "true";
}
