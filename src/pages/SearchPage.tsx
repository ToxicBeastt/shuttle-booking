import useSWR from 'swr';
import { useEffect } from 'react';
import { useShuttleStore, Shuttle } from '../stores/shuttleStore';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import ShuttleList from '../components/ShuttleList';

const SearchPage: React.FC = () => {
  const { data, error, isLoading } = useSWR('/data/shuttles.json', (url) => fetch(url).then(res => res.json()));
  const { shuttles, filteredShuttles, searchCriteria, setShuttles, search, resetSearch } = useShuttleStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.schedules) {
      setShuttles(data.schedules);
    }
  }, [data, setShuttles]);

  const handleSearch = (formData: any) => {
    const criteria = {
      origin: formData.origin,
      destination: formData.destination,
      operator: formData.operator || undefined,
      departureTime: formData.departureTime || undefined,
      minPrice: formData.minPrice ? Number(formData.minPrice) : undefined,
      maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
      date: formData.departureDate || undefined,
    };
    search(criteria);
  };

  const handleSelect = (shuttle: Shuttle, time: string) => {
    // Navigate to passenger form page with selected shuttle and time as state
    navigate('/passenger', { state: { shuttle, time } });
  };

  if (error) return <div>Failed to load data</div>;

  return (
    <div className="App min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Shuttle Booking App</h1>
        <SearchForm onSearch={handleSearch} onReset={resetSearch} />
        <ShuttleList
          shuttles={filteredShuttles}
          onSelect={handleSelect}
          isLoading={isLoading}
          searchCriteria={searchCriteria || undefined}
          onReset={resetSearch}
        />
      </div>
    </div>
  );
};

export default SearchPage;
