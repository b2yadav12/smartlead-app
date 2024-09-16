import { useState } from 'react';
import { Tabs, Card } from 'antd';
import EmailConfig from './components/email-config';

const TABS = {
  emailConfigPage: {
    key: 'emailConfigPage',
    title: 'Email Config',
    content: <EmailConfig />,
  },
  sendEmailPage: {
    key: 'sendEmailPage',
    title: 'Send Email',
    content: <Card>Send Email Page</Card>,
  }
}

function App() {
  const [tabs, setTabs] = useState(Object.values(TABS));
  const [activeTabKey, setActiveTabKey] = useState(TABS.emailConfigPage.key);

  return (
    <>
      <Card>
        <Tabs
          activeKey={activeTabKey}
          onChange={(activeKey) => setTabs([TABS[activeKey]])}
        >
          {tabs.map((tab) => (
            <Tabs.TabPane key={tab.key} tab={tab.title}>
              {tab.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
    </>
  )
}

export default App
