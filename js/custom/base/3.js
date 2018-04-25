window.addEventListener("load", function(){
    alert("Somebody made " + calculateMoneyMadePerWeek() + " euros this week!");
});

function calculateMoneyMadePerWeek() {
	let moneyMade = getDailySalary() * WORKING_DAYS_IN_WEEK;
	return moneyMade;
}
