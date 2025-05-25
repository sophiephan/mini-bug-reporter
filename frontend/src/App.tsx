import { Layout } from './components/Layout';
import { BugList } from './components/BugList';
import { BugForm } from './components/BugForm';
import { useBugs } from './hooks/useBugs';

function App() {
  const { bugs, loading, error, addBug, removeBug } = useBugs();

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bug Tracking System</h1>
      
      <BugForm onSubmit={addBug} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bug Reports</h2>
        <BugList 
          bugs={bugs} 
          loading={loading} 
          error={error} 
          onDelete={removeBug} 
        />
      </div>
    </Layout>
  );
}

export default App;
