'use client';

import Feed from './components/Feed/Feed';
import Sidebar from './components/Sidebar';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="flex">
        <Sidebar />
        <Feed />
      </div>
    </div>
  );
}
