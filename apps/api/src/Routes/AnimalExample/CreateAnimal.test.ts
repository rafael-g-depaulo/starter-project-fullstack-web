import getAnimalExampleRepo from "Repository/AnimalExampleRepository.mock"
import CreateAnimal from "./CreateAnimal"

describe('CreateAnimal Route Handler', () => {

  const [ AnimalExampleRepo, RepoConfig ] = getAnimalExampleRepo()
  const createAnimalRoute = CreateAnimal({ AnimalExampleRepo })
  
  // reset route and db between tests
  beforeEach(() => {
    RepoConfig.resetTable()
  })

  it('correctly saves the animal given in the request body in the database table', async () => {
    
    // mock response
    const mockResponse = {
      json: jest.fn()
    }

    // request body
    const body = {
      name: "Cat",
      rank: 5
    }

    // created animal
    const createdAnimal = {
      name: "Cat",
      rank: 5,
      id: `0.Cat.5`, // id is created on the mock repository implementation of the create function
    }

    // call route
    await createAnimalRoute({ body }, mockResponse)

    // expect new dog to be save to table
    const AnimalExampleTable = RepoConfig.table
    expect(AnimalExampleTable.length).toBe(1)
    expect(AnimalExampleTable[0]).toMatchObject(createdAnimal)
  })

  it('correctly returns the new animal in the response json', async () => {
    // mock response
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse.json)
    }

    // request body
    const body = {
      name: "Dog",
      rank: 25
    }

    // created animal
    const createdAnimal = {
      name: "Dog",
      rank: 25,
      id: `0.Dog.25`, // id is created on the mock repository implementation of the create function
    }

    // call route
    await createAnimalRoute({ body }, mockResponse)

    // expect newly created animal to be sent to client in response json
    const mockCalls = mockResponse.json.mock.calls
    expect(mockCalls.length).toBe(1)  // expect to be called 1 time
    expect(mockCalls[0][0]).toMatchObject({ animal: createdAnimal })

    // if status is called, it should be called once with 200
    const statusCalls = mockResponse.status.mock.calls
    expect(statusCalls.length).toBeLessThanOrEqual(1)
    expect(statusCalls.length).toBeGreaterThanOrEqual(0)
    if (statusCalls.length === 1)
      expect(statusCalls[0][0]).toBe(200)
  })
})
