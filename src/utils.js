const petList = ['Snow', 'Gold', 'Brown'];

export const getPetList = () => Promise.resolve([...petList]);

export const addPet = (name) => {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return Promise.reject(new Error('Name is required.'));
  }
  if (petList.includes(name)) {
    return Promise.reject(new Error(`${name} is already in the list.`));
  }
  petList.push(name);
  return Promise.resolve([...petList]);
};

export const removePet = () => {
  if (petList.length === 0) {
    return Promise.reject(new Error('There are no pets to be removed.'));
  }
  petList.pop();
  return Promise.resolve([...petList]);
};