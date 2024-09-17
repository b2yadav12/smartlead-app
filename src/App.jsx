import { useState, useEffect } from 'react';
import { Tabs, Card } from 'antd';
import EmailConfig from './components/email-config';

const TABS = {
  emailConfigPage: {
    key: 'emailConfigPage',
    title: 'Email Config'
  },
  sendEmailPage: {
    key: 'sendEmailPage',
    title: 'Send Email',
  }
}

/**
 * App component manages the state and behavior of tabs, including their activation and disabling based on email configuration.
 */
function App() {
  const [tabs, setTabs] = useState([]);
  const [emailConfigId, setEmailConfigId] = useState(localStorage.getItem('emailConfigId') || '');
  const [activeTabKey, setActiveTabKey] = useState();

  useEffect(() => {
    // Check if email configuration is saved or not
    const tabsList = [];
    Object.values(TABS).forEach((tab) => {
      tab.disabled = tab.key === TABS.sendEmailPage.key ? !emailConfigId : false;
      tabsList.push(tab);
    });

    setTabs(tabsList);
    setActiveTabKey(emailConfigId ? TABS.sendEmailPage.key : TABS.emailConfigPage.key);
  }, [emailConfigId])

  const updateEmailConfigId = (id) => {
    localStorage.setItem('emailConfigId', id);
    setEmailConfigId(id);
  }

  return (
    <>
      <Card>
        <Tabs
          activeKey={activeTabKey}
          onChange={(activeKey) => {
            setActiveTabKey(activeKey);
          }}
          items={tabs?.map((tab) => ({
            key: tab.key,
            label: tab.title,
            disabled: tab.disabled,
            children: tab.key === TABS.emailConfigPage.key 
              ? <EmailConfig updateEmailConfigId={updateEmailConfigId} /> 
              : <Card>Send Email Page</Card>
          }))}
        />
      </Card>
    </>
  )
}

export default App
