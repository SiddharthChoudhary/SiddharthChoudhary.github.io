import './App.css';
import useScript from './usescript';

function App() {
  useScript('js/main.js') // async on body
  return (
    <div className="App">
    </div>
  );
}

export default App;
