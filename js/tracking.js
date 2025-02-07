// JavaScript source code
const packages = [
	{
		customerId : 'C001', bookingId: 'B001',status : 'Shipped',lastUpdated : '2025-01-04'
	},
	{
		customerId : 'C001', bookingId: 'B001',status : 'Shipped',lastUpdated : '2025-05-04'
	},

	{
		customerId : 'C001', bookingId: 'B001',status : 'Shipped',lastUpdated : '2025-02-04'
	},
    {
		customerId : 'C001', bookingId: 'B001',status : 'Shipped',lastUpdated : '2025-03-04'
	},

	{
		customerId : 'C001', bookingId: 'B001',status : 'Shipped',lastUpdated : '2025-04-04'
	}

];

document.addEventListener{
	"DOMContentLoaded",loadPackages);
}


function loadPackages(){

displayPackages(packages);

}


function searchPakage(){

const searchValue = document.getElementById("search").value.toLowerCase();
const filteredPakages = packages.filter(pkg => pkg.customerIdId.toLowerCase().includes(searchValue) ||
pkg.bookingId.toLowerCase().includes(searchValue)
);
displayPackages(filteredPackagaes);

}


function displayPackages(packageArray){

const packageList = document.getElementById("packageList");
pakageList.innerHTML = packageArray.sort((a,b)=> new Date(b.lastUpadated) - new Date(a.lastUpadated)).map(pkg => 
<tr> 
<td> ${pkg.bookingId} </td> 
<td> ${pkg.customerId} </td>
<td> ${pkg.status} </td>
<td> ${pkg.lastUpdated} </td>
</tr>).join("");


}

