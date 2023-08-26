
import './App.css';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';

function App() {
  return (
    <div className="App">
      <CitySearch/>
      <NumberOfEvents/>
     <EventList/>
    </div>
  );
}

export default App;
