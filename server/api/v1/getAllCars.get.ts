export default defineEventHandler(async (event) => {
	const dummydata = [
		{ id: 1, make: 'Toyota', model: 'Camry', year: 2020, price: 24000 },
		{ id: 2, make: 'Honda', model: 'Civic', year: 2019, price: 22000 },
		{ id: 3, make: 'Ford', model: 'Mustang', year: 2021, price: 35000 },
		{ id: 4, make: 'Tesla', model: 'Model 3', year: 2022, price: 45000 },
		{ id: 5, make: 'Chevrolet', model: 'Impala', year: 2018, price: 21000 }
	]
	return dummydata
})