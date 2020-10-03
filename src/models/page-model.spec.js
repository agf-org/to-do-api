const mongoHandler = require('../controllers/mongo-memory-server-handler')
const PageModel = require('./page-model')

beforeAll(async () => {
  await mongoHandler.connect()
})

afterEach(async () => {
  await mongoHandler.clearDatabase()
})

afterAll(async () => {
  await mongoHandler.closeDatabase()
})

describe('Page model tests', () => {
  it('findById returns a page', async () => {
    const pageInstance = new PageModel({items: []})
    const savedPage = await pageInstance.save()
    const page = await PageModel.findById(savedPage._id)
    expect(page._id).toBeTruthy()
  })
  
  it('find returns a list of pages', async () => {
    const pageInstance = new PageModel({items: []})
    await pageInstance.save()
    const pages = await PageModel.find({})
    expect(pages).toHaveLength(1)
  })
  
  it('create saves a page', async () => {
    const page = await PageModel.create({items: []})
    expect(page).toBeTruthy()
  })

  it('findByIdAndDelete deletes a page', async () => {
    const pageInstance = new PageModel({items: []})
    const savedPage = await pageInstance.save()
    const page = await PageModel.findByIdAndDelete(savedPage._id)
    expect(page._id).toBeTruthy()
  })
})
