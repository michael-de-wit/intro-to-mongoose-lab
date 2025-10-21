const dotenv = require('dotenv');
dotenv.config()
const { default: mongoose } = require('mongoose');
const Customer = require(`./models/customer.js`)
const prompt = require('prompt-sync')();

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`connected`);

    console.log(`\nWelcome to the CRM\n\nWhat would you like to do?\n`)

    let actionToRun = ``

    while (actionToRun != `5`) {
        console.log(`1. Create a customer\n2. View all customers\n3. Update a customer\n4. Delete a customer\n5. Quit\n`);
        
        actionToRun = prompt(`Number of action to run: `)
        console.log(`\nYou chose ${actionToRun}\n`);
        
        // const deletedCustomer = await Customer.findByIdAndDelete(`68f7d2e2df0c8a309a6da043`) // delete a given ID
        const customerArray = await Customer.find() // get the customer array
        const customerArrayLength = customerArray.length // find the customer array length, to make sure there is at least 1 customer for the action, if appropriate
        // console.log(`customerArrayLength `, customerArrayLength);

        if (actionToRun === `1`) {  // Create a customer
            
            let nameToCreate = prompt(`Name: `)
            let ageToCreate = prompt('Age: ')

            let createdCustomer = await Customer.create({ // create information
                name: nameToCreate,
                age: ageToCreate,
            })
            console.log(`Customer created:\n${createdCustomer}\n`)
            
        } else if (actionToRun === `2`) { // View all customers
            customerArray.forEach((cust, index) => {
                console.log(`${index + 1}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
            })
            console.log(`\n`);
            
        } else if (actionToRun === `3`) { // Udpdate a customer
            if (customerArrayLength > 0) {
                
                customerArray.forEach((cust, index) => {
                    console.log(`${index + 1}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
                })
                console.log(`\n`);

                let customerNumberToUpdate = prompt(`Which customer would you like to update? (Enter the line number) `)
                
                customerArray.forEach((cust, index) => {
                    if(index + 1 === Number(customerNumberToUpdate)) {
                        console.log(`Customer to update: ${customerNumberToUpdate}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
                        customerIdToUpdate = cust.id
                    }
                })

                console.log(`Update the record:\n`);
                let CustomerNameToUpdate = prompt(`Name: `)
                let CustomerAgeToUpdate = prompt(`Age: `)                
                
                const updatedCustomer = await Customer.findByIdAndUpdate(
                customerIdToUpdate,
                {
                    name: CustomerNameToUpdate,
                    age: CustomerAgeToUpdate,
                },
                { new:true }
            )

            } else {
                console.log(`No available customers to update`);
            }
        } else if (actionToRun === '4') { // Delete a customer
            if (customerArrayLength > 0) {
                
                customerArray.forEach((cust, index) => {
                    console.log(`${index + 1}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
                })
                console.log(`\n`);

                let customerNumberToDelete = prompt(`Which customer would you like to delete? (Enter the line number) `)
                console.log(`\n`);
                customerArray.forEach((cust, index) => {
                    if(index + 1 === Number(customerNumberToDelete)) {
                        console.log(`Customer to delete: ${customerNumberToDelete}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}\n`)
                        customerIdToDelete = cust.id
                        customerNameToDelete = cust.name
                        customerAgeToDelete = cust.age
                    }
                })
                
                const D = await Customer.findByIdAndDelete(customerIdToDelete) // delete a given ID
                console.log(`${customerNumberToDelete}. ID: ${customerIdToDelete} -- Name: ${customerNameToDelete}, Age: ${customerAgeToDelete} has been deleted`)
                
            } else {
                console.log(`No available customers to delete`);
            }
        } else if (actionToRun === '5') { // Quit
            await mongoose.disconnect()
            console.log(`disconnected`);

        } else {
            console.log(`Enter a number between 1-5`);
        }
        
    }
}

connect()