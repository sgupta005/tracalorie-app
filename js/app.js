class CalorieTracker{
    constructor(){
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCaloriesTotal();
        this._displayCalorieLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgressBar();

    }
    
    // Public Methods 
    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._renderStats();
    }
    
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._renderStats();
    }

    // Private Methods
    _displayCaloriesTotal(){
        document.getElementById('calories-total').textContent = this._totalCalories;
    }

    _displayCalorieLimit(){
        document.getElementById('calories-limit').textContent = this._calorieLimit;
    }

    _displayCaloriesConsumed(){
        let caloriesConsumed = this._meals.reduce((total,meal)=>total+meal.calories, 0);
        document.getElementById('calories-consumed').textContent = caloriesConsumed;
    }

    _displayCaloriesBurned(){
        let caloriesBurned = this._workouts.reduce((total,workout)=>total+workout.calories, 0);
        document.getElementById('calories-burned').textContent = caloriesBurned;
    }

    _displayCaloriesRemaining(){
        const calRemEl = document.getElementById('calories-remaining');
        const progressBarEl = document.getElementById('calorie-progress');
        const calRem = this._calorieLimit - this._totalCalories;
        calRemEl.textContent = calRem;
        
        if (calRem<=0){
            calRemEl.parentElement.parentElement.classList.remove('bg-light');
            calRemEl.parentElement.parentElement.classList.add('bg-danger');
            progressBarEl.classList.remove('bg-success');
            progressBarEl.classList.add('bg-danger');
        }else{
            calRemEl.parentElement.parentElement.classList.remove('bg-danger');
            calRemEl.parentElement.parentElement.classList.add('bg-light');
            progressBarEl.classList.remove('bg-danger');
            progressBarEl.classList.add('bg-success');
        }
    }

    _displayProgressBar(){
        const perc = (this._totalCalories/this._calorieLimit)*100;
        const width = Math.min(perc,100);
        document.getElementById('calorie-progress').style.width = `${width}%`;

    }

    _renderStats(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgressBar();
    }
}

class Meal{
    constructor(name,calories){
        this.id = Date.now();
        this.name = name;
        this.calories = calories;
    }
}

class Workout{
    constructor(name,calories){
        this.id = Date.now();
        this.name = name;
        this.calories = calories;
    }
}


