import { useEffect, useState } from 'react';
import { addPet, getPetList, removePet } from './utils';

function App() {
  const [petName, setPetName] = useState('');
  const [petList, setPetList] = useState([]);

  // read a pet list during initialization
  useEffect(() => {
    getPetList()
      .then((response) => setPetList(response))
      .catch((error) => console.error(error.message));
  }, []);

  // add a pet by name
  const addOnePet = () => {
    addPet(petName)
      .then((response) => {
        setPetList(response);
        setPetName('');
      })
      .catch((error) => console.error(error.message));
  };

  // remove the last pet
  const removeLastPet = () => {
    removePet()
      .then((response) => setPetList(response))
      .catch((error) => console.error(error.message));
  };

  // get a message about pets
  const getMessage = () =>
    petList.length === 0
      ? 'You have no pets.'
      : `This is a list of your pets: ${petList.join(', ')}.`;

  return (
    <>
      <div>{getMessage()}</div>
      <input
        value={petName}
        onChange={(event) => setPetName(event.target.value)}
      />
      <button onClick={addOnePet}>Add One Pet</button>
      <button onClick={removeLastPet}>Remove Last Pet</button>
    </>
  );
}

export default App;