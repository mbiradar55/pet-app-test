import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import App from './App';
import * as utils from './utils';

describe('renders <App />', () => {
  beforeEach(jest.spyOn(console, 'error').mockImplementation(() => undefined));
  afterEach(() => jest.clearAllMocks());

  it('should pass mount snapshot test', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(<App />);
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should pet list test', async () => {
    utils.getPetList = jest.fn().mockResolvedValue(['Snow', 'Gold', 'Brown']);
    let wrapper;
    await act(async () => {
      wrapper = mount(<App />);
    });
    expect(wrapper.text()).toContain(
      'This is a list of your pets: Snow, Gold, Brown.'
    );
    expect(utils.getPetList).toBeCalledTimes(1);
    utils.getPetList.mockRestore();
  });
  it('should show the failed text message', async () => {
    utils.getPetList = jest.fn().mockRejectedValue([]);
    let wrapper;
    await act(async () => {
      wrapper = mount(<App />);
    });
    expect(wrapper.text()).toContain('You have no pets.');
    expect(utils.getPetList).toBeCalledTimes(1);
    utils.getPetList.mockRestore();
  });
  it('should be able to delete a pet', async () => {
    utils.getPetList = jest.fn().mockResolvedValue(['Snow', 'Gold', 'Brown']);
    utils.removePet = jest.fn().mockResolvedValue(['Snow', 'Gold']);
    let wrapper;
    await act(async () => {
      wrapper = mount(<App />);
    });
    const deleteButton = wrapper.find('button').at(1);
    await act(async () => {
      deleteButton.simulate('click');
    });
    expect(wrapper.text()).toContain(
      'This is a list of your pets: Snow, Gold.'
    );
    expect(utils.getPetList).toBeCalledTimes(1);
    expect(utils.removePet).toBeCalledTimes(1);
  });
  it('should not be able to delete no pets', async () => {
    utils.getPetList = jest.fn().mockResolvedValue([]);
    utils.removePet = jest
      .fn()
      .mockRejectedValue(new Error('There are no pets to be removed.'));
    let wrapper;
    await act(async () => {
      wrapper = mount(<App />);
    });
    const deleteButton = wrapper.find('button').at(1);
    await act(async () => {
      deleteButton.simulate('click');
    });
    expect(wrapper.text()).toContain('You have no pets.');
    expect(utils.getPetList).toBeCalledTimes(1);
    expect(utils.removePet).toBeCalledTimes(1);
  });
  it('should not be able to add empty pet name', async () => {
    utils.getPetList = jest.fn().mockResolvedValue(['Snow', 'Gold', 'Brown']);
    utils.addPet = jest.fn().mockRejectedValue(new Error('Name is required.'));
    let wrapper;
    await act(async () => {
      wrapper = mount(<App />);
    });
    const addButton = wrapper.find('button').at(0);
    await act(async () => {
      addButton.simulate('click');
    });
    expect(wrapper.text()).toContain(
      'This is a list of your pets: Snow, Gold, Brown.'
    );
    expect(utils.getPetList).toBeCalledTimes(1);
    expect(utils.addPet).toBeCalledTimes(1);
  });
  it('should be able to add a pet with name', async () => {
    const initialList = ['Snow', 'Gold', 'Brown'];
    utils.getPetList = jest.fn().mockResolvedValue(initialList);
    utils.addPet = jest
      .fn()
      .mockImplementation((name) => Promise.resolve([...initialList, name]));
    let wrapper;
    await act(async () => {
      wrapper = mount(<App />);
    });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Yellow' } });
    const addButton = wrapper.find('button').at(0);
    await act(async () => {
      addButton.simulate('click');
    });
    expect(wrapper.text()).toContain(
      'This is a list of your pets: Snow, Gold, Brown, Yellow.'
    );
    expect(utils.getPetList).toBeCalledTimes(1);
    expect(utils.addPet).toBeCalledTimes(1);
  });
});
