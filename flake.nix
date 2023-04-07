{
  inputs.nixpkgs.url = github:NixOS/nixpkgs/nixos-22.11;
  inputs.ascii-pay-server.url = github:ascii-dresden/ascii-pay-server;

  outputs = { self, nixpkgs, ascii-pay-server, ... }@inputs: 
  let
    pkgs = import nixpkgs { 
      system = "x86_64-linux"; 
      overlays = [
        ascii-pay-server.overlay
      ];
    };
  in {
    defaultPackage."x86_64-linux" = pkgs.callPackage ./derivation.nix {
      src = ./.;
    };

    overlay = (final: prev: {
      ascii-pay-frontend-dashboard = pkgs.callPackage ./derivation.nix {
        src = ./.;
      };
    });
  };
}
