import React from 'react';
import { useHistory } from 'react-router-dom';
import './SettingsPage.scss';
import SidebarPage from './components/SidebarPage';
import { AsciiPayAuthenticationClient, WebSocketMessageHandler } from './ascii-pay-authentication-client';

const colors = ['teal', 'green', 'blue', 'purple', 'yellow', 'orange', 'red'];

export default function SettingsPage(props: { authClient: AsciiPayAuthenticationClient }) {
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  const [darkMode, setDarkMode] = React.useState(localStorage.getItem('dark-mode') === 'true');
  React.useEffect(() => {
    document.body.dataset['theme'] = darkMode ? 'dark' : 'light';
    localStorage.setItem('dark-mode', darkMode.toString());
  }, [darkMode]);

  const [highlightColor, setHighlightColor] = React.useState(localStorage.getItem('highlight-color') || 'blue');
  React.useEffect(() => {
    document.body.dataset['highlight'] = highlightColor;
    localStorage.setItem('highlight-color', highlightColor);
  }, [highlightColor]);

  const [statusInformation, setStatusInformation] = React.useState('');
  const handler: WebSocketMessageHandler = {
    onStatusInformation(status: string) {
      setStatusInformation(status);
      return true;
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    props.authClient.requestStatusInformation();
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);

  const hightlightViews = colors.map((c) => (
    <div
      key={c}
      className={'color-' + c + (c === highlightColor ? ' active' : '')}
      onClick={() => setHighlightColor(c)}
    ></div>
  ));

  return (
    <SidebarPage defaultAction={handleGoBack}>
      <div className="settings">
        <span>Settings</span>
        <div className="settings-columns">
          <div>
            <div>
              <span>Theme</span>
              <div className="settings-item settings-theme">
                <div
                  data-name="Light mode"
                  className={'theme-light' + (!darkMode ? ' active' : '')}
                  onClick={() => setDarkMode(false)}
                >
                  <img src="/favicon.svg" alt="" />
                </div>
                <div
                  data-name="Dark mode"
                  className={'theme-dark' + (darkMode ? ' active' : '')}
                  onClick={() => setDarkMode(true)}
                >
                  <img src="/favicon.svg" alt="" />
                </div>
              </div>
            </div>
            <div>
              <span>Highlight color</span>
              <div className="settings-item settings-highlight-color">{hightlightViews}</div>
            </div>
            <div>
              <span>Actions</span>
              <div className="settings-item settings-actions form">
                <button onClick={() => window.location.reload()}>Reload page</button>
                <button onClick={() => props.authClient.requestReboot()}>Reboot terminal</button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <span>Proxy status</span>
              <div className="settings-item settings-proxy-status">
                <code>{statusInformation}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarPage>
  );
}
