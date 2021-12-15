{  }:
  allDeps:
    {
      key = { name = "ascii-pay-dashboard"; scope = ""; };
      version = "1.0.0";
      nodeBuildInputs = let
        a = allDeps;
      in [
        (a."@types/node@^12.0.0")
        (a."@types/jest@^24.0.0")
        (a."husky@^7.0.2")
        (a."@ant-design/charts@^1.2.5")
        (a."antd@^4.16.10")
        (a."react-redux@^7.2.0")
        (a."react-dom@^17.0.2")
        (a."@testing-library/react@^9.3.2")
        (a."@types/react@^16.9.0")
        (a."moment@^2.29.1")
        (a."@ant-design/icons@^4.6.2")
        (a."@testing-library/user-event@^7.1.2")
        (a."@reduxjs/toolkit@^1.5.1")
        (a."react@^17.0.2")
        (a."apollo@^2.33.6")
        (a."react-router-dom@^5.2.0")
        (a."react-router@^5.2.0")
        (a."@apollo/client@^3.4.13")
        (a."typescript@~4.1.5")
        (a."sass@^1.37.5")
        (a."@ant-design/colors@^6.0.0")
        (a."@types/react-router-dom@^5.1.8")
        (a."@testing-library/jest-dom@^4.2.4")
        (a."react-scripts@4.0.3")
        (a."@types/react-router@^5.1.16")
        (a."npm-run-all@^4.1.5")
        (a."pretty-quick@^3.1.1")
        (a."@types/react-redux@^7.1.7")
        (a."@types/react-dom@^16.9.0")
        (a."graphql@^15.6.0")
        (a."prettier@^2.4.1")
        ];
      meta = { description = "Dashboard ui for ascii-pay"; };
      }
