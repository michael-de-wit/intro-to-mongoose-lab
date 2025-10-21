const dotenv = require('dotenv'); // in order to use .env
dotenv.config() // in order to use .env
const { default: mongoose } = require('mongoose'); // to deal with MongoDB
const Customer = require(`./models/customer.js`) // use the schema in customer.js
const prompt = require('prompt-sync')(); // to use prompting

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI) // connect to MongoDB
    console.log(`connected`);

    console.log(`\nWelcome to the CRM\n\nWhat would you like to do?\n`)

    let actionToRun = ``

    while (actionToRun != `5`) { // Loop until the user chooses 5 to quit
        console.log(`1. Create a customer\n2. View all customers\n3. Update a customer\n4. Delete a customer\n5. Quit\n`);

        actionToRun = prompt(`Number of action to run: `)
        console.log(``);

        const customerArray = await Customer.find() // get the customer array
        const customerArrayLength = customerArray.length // find the customer array length, to make sure there is at least 1 customer for the action, if appropriate

        if (actionToRun === `1`) {  // Create a customer

            let nameToCreate = prompt(`Name: `)
            let ageToCreate = prompt('Age: ')

            let createdCustomer = await Customer.create({ // create DB document
                name: nameToCreate,
                age: ageToCreate,
            })

            console.log(`\nCustomer created -- ID: ${createdCustomer.id} -- Name: ${createdCustomer.name}, Age: ${createdCustomer.age}\n`)

        } else if (actionToRun === `2`) { // View all customers
            customerArray.forEach((cust, index) => { // Loop through each document and show their details
                console.log(`${index + 1}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
            })
            console.log(`\n`);

        } else if (actionToRun === `3`) { // Update a customer
            if (customerArrayLength > 0) { // If there is at least 1 customer to update

                customerArray.forEach((cust, index) => { // Loop through the customer array to show their details; includes line numbers
                    console.log(`${index + 1}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
                })
                console.log(`\n`);

                let customerNumberToUpdate = prompt(`Which customer would you like to update? (Enter the line number) `)

                customerArray.forEach((cust, index) => { // loops through the customer array to find the document which matches the selected line number
                    if (index + 1 === Number(customerNumberToUpdate)) { //index + 1 is equivalent to the line number; checks which line number is the same as the selected line number 
                        console.log(`\nCustomer to update -- ${customerNumberToUpdate}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
                        customerIdToUpdate = cust.id // saves the ID of the documented of the selected line number
                    }
                })

                console.log(`Update the record:`);
                let CustomerNameToUpdate = prompt(`Name: `)
                let CustomerAgeToUpdate = prompt(`Age: `)

                const updatedCustomer = await Customer.findByIdAndUpdate( //Update the document of the selected line number with the inputted info
                    customerIdToUpdate,
                    {
                        name: CustomerNameToUpdate,
                        age: CustomerAgeToUpdate,
                    },
                    { new: true }
                )

            } else { // If there are no customers to update
                console.log(`No available customers to update`);
            }
        } else if (actionToRun === '4') { // Delete a customer
            if (customerArrayLength > 0) { // Checks that there is at least 1 customer to delete

                customerArray.forEach((cust, index) => { // Loops through the customer array to show their details
                    console.log(`${index + 1}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}`)
                })
                console.log(``);

                let customerNumberToDelete = prompt(`Which customer would you like to delete? (Enter the line number) `)
                console.log(``);
                customerArray.forEach((cust, index) => { // Loop through the customer array to look for the selected line number
                    if (index + 1 === Number(customerNumberToDelete)) { // Looks for the matching selected line number
                        console.log(`Customer to delete -- ${customerNumberToDelete}. ID: ${cust.id} -- Name: ${cust.name}, Age: ${cust.age}\n`)
                        customerIdToDelete = cust.id // save the ID of the customer to delete
                        customerNameToDelete = cust.name // save the name of the customer to delete
                        customerAgeToDelete = cust.age // save the age of the customer to delete
                    }
                })

                const D = await Customer.findByIdAndDelete(customerIdToDelete) // delete a given ID
                console.log(`${customerNumberToDelete}. ID: ${customerIdToDelete} -- Name: ${customerNameToDelete}, Age: ${customerAgeToDelete} has been deleted\n`)

            } else { // There are no customers in the array available to delete
                console.log(`No available customers to delete`);
            }
        } else if (actionToRun === '5') { // Quit
            mongoose.connection.close() // closes the connection to MongoDB

            console.log(`exiting...`);

        } else { // the user selected something other than 1-5
            console.log(`Enter a number between 1-5\n`);
        }

    }
}

connect()