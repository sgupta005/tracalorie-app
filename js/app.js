class CalorieTracker{
    constructor(){
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayCaloriesTotal();
        this._displayCalorieLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayProgressBar();

        document.getElementById('limit').value = this._calorieLimit;
    }
    
    // Public Methods 
    setLimit(limit){
        this._calorieLimit = limit;
        Storage.setCalorieLimit(limit)
        this._displayCalorieLimit();
        this._renderStats();
    }

    reset(){
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._renderStats();
    }

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.setMeal(meal);
        this._displayMeal(meal);
        this._renderStats();
    }
    
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.setWorkout(workout);
        this._displayWorkout(workout);
        this._renderStats();
    }

    removeMeal(id){
        const [mealToBeRemoved] = this._meals.filter(meal=>meal.id === +id);
        this._totalCalories-=mealToBeRemoved.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeMeal(id);

        //Removing the meal from meal array 
        this._meals = this._meals.filter(meal=> meal.id !== +id);

        this._renderStats();
    }

    removeWorkout(id){
        const [workoutToBeRemoved] = this._workouts.filter(workout=>workout.id === +id);
        this._totalCalories+=workoutToBeRemoved.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeWorkout(id);

        //Removing the workout from workout array 
        this._workouts = this._workouts.filter(workout=> workout.id !== +id);

        this._renderStats();
    }

    loadMeals(){
        this._meals.forEach(meal=>this._displayMeal(meal));
    }

    loadWorkouts(){
        this._workouts.forEach(workout=>this._displayWorkout(workout));
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

    _displayMeal(meal){
        const meals = document.getElementById('meal-items');
        const div = document.createElement('div');
        div.setAttribute('data-id', meal.id);
        div.className = 'card my-2';
        div.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                        ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `
        meals.appendChild(div);
    }

    _displayWorkout(workout){
        const workouts = document.getElementById('workout-items');
        const div = document.createElement('div');
        div.setAttribute('data-id', workout.id);
        div.className = 'card my-2';
        div.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${workout.name}</h4>
                    <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                        ${workout.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `
        workouts.appendChild(div);
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

class Storage{
    static getCalorieLimit(defaultLimit=2000){
        let calorieLimit;
        if (localStorage.getItem('calorieLimit')===null){
            calorieLimit = defaultLimit;
        }else{
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(limit){
        localStorage.setItem('calorieLimit', limit);
    }

    static getTotalCalories(defaultValue=0){
        let totalCalories;
        if (localStorage.getItem('totalCalories')===null){
            totalCalories = defaultValue;
        }else{
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    static setTotalCalories(totalCalories){
        localStorage.setItem('totalCalories', totalCalories);
    }

    static getMeals(){
        let meals;
        if (localStorage.getItem('meals')===null){
            meals = [];
        }else{
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static setMeal(meal){
        let meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(id){
        let meals = Storage.getMeals();
        meals = meals.filter(meal=>meal.id!=id);
        localStorage.setItem('meals',JSON.stringify(meals));
    }

    static getWorkouts(){
        let workouts;
        if (localStorage.getItem('workouts')===null){
            workouts = [];
        }else{
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static setWorkout(workout){
        let workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(id){
        let workouts = Storage.getWorkouts();
        workouts = workouts.filter(workout=>workout.id!=id);
        console.log(workouts);
        localStorage.setItem('workouts',JSON.stringify(workouts));
    }

    static clearAll(){
        localStorage.removeItem('totalCalories');
        localStorage.removeItem('meals');
        localStorage.removeItem('workouts');
    }
}

class App{
    constructor(){
        this._tracker = new CalorieTracker();

        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
        document.getElementById('filter-meals').addEventListener('input', this._filterItems.bind(this, 'meal'));
        document.getElementById('filter-workouts').addEventListener('input', this._filterItems.bind(this, 'workout'));
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));

        this._tracker.loadMeals();
        this._tracker.loadWorkouts();
    }
    
    _setLimit(e){
        e.preventDefault();
        let limit  = document.getElementById('limit').value;
        if (limit === '' || 'abcdefghijklmnopqrstuvwxyz'.includes(limit)){
            alert('Please enter a valid value');
            return;
        }
        this._tracker.setLimit(+limit);
        limit = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }

    _reset(){
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }

    _filterItems(type,e){
        const items = document.getElementById(`${type}-items`).children;
        Array.from(items).forEach(item => {
            if (item.textContent.toLowerCase().includes(e.target.value.toLowerCase())){
                item.style.display = 'flex';
            }else{
                item.style.display = 'none';
            }
        })
    }

    _removeItem(type,e){
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')){
            if (confirm('Are you sure?')){
                const id = e.target.closest('.card').getAttribute('data-id');
                if (type==='meal'){
                    this._tracker.removeMeal(id);
                }else{
                    this._tracker.removeWorkout(id);
                }
                e.target.closest('.card').remove();
            }
        }
    }

    _newItem(type,e){
        e.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);
        if (name.value === '' || calories.value === ''){
            alert('Please enter valid fields')
            return;
        }
        if (type === 'meal'){
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        }else{
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }
        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true
        });
    }

}

const app = new App();