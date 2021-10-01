import React from 'react';
import { useHistory } from 'react-router-dom';
import './SettingsPage.scss';
import SidebarPage from './components/SidebarPage';

const colors = ['teal', 'green', 'blue', 'purple', 'yellow', 'orange', 'red'];

export default function SettingsPage() {
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
                <div className={'theme-light' + (!darkMode ? ' active' : '')} onClick={() => setDarkMode(false)}></div>
                <div className={'theme-dark' + (darkMode ? ' active' : '')} onClick={() => setDarkMode(true)}></div>
              </div>
            </div>
            <div>
              <span>Highlight color</span>
              <div className="settings-item settings-highlight-color">{hightlightViews}</div>
            </div>
            <div>
              <span>Actions</span>
              <div className="settings-item settings-actions form">
                <button>Reboot</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarPage>
  );
}
