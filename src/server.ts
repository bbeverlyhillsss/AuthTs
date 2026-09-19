import app from './app.js'
import { env } from './config/config.js'
import connectToDataBase from './config/database.js'


const startApplication = async (): Promise<void> => {
    try {
        await connectToDataBase()
        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`)
        })
    } catch (error) {
        console.log('Error starr application', error)
        process.exit(1)
    }
}


startApplication()