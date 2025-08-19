import React from 'react'

interface PageHeaderProps {
  activeTab: 'form' | 'font-test'
  onTabChange: (tab: 'form' | 'font-test') => void
}

const PageHeader: React.FC<PageHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="app-header">
      <h1>onRouteBC Policy Engine - React Example</h1>
      <nav className="nav-tabs">
        <button 
          className={activeTab === 'form' ? 'active' : ''} 
          onClick={() => onTabChange('form')}
        >
          Permit Application
        </button>
        <button 
          className={activeTab === 'font-test' ? 'active' : ''} 
          onClick={() => onTabChange('font-test')}
        >
          Vehicle Font Test
        </button>
      </nav>
    </header>
  )
}

export default PageHeader
