import { prisma } from './lib/prisma.js'

async function main() {
    console.log('Clearing all shortened links...')
    const result = await prisma.shortener.deleteMany({})
    console.log(`Deleted ${result.count} links`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
