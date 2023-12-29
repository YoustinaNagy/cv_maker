window.onload = function() {
    let btn = document.querySelector('#add');
    btn.addEventListener('click', function(event) {
        const mainContent = document.getElementById('content');
        let count = document.querySelectorAll('form').length + 1;
        let workExperiance = document.createElement('div');
        workExperiance.classList.add('work-experiance');
        workExperiance.innerHTML = `
        <form>
            <div class="form-row">
                <div class="col-md-12 mb-3">
                        <label for="skill${count}">Skill</label>
                        <input type="text" class="form-control" id="skill${count}" name="skill${count}" >
                </div>
                <div class="col-md-6 mb-3">
                    <label for="profeciency${count}" class="form-label">profeciency</label>
                    <input type="range" class="form-range" id="profeciency${count}" min="0" max="100" step="10">
                </div>
            </div>
        </form>
        `
        mainContent.appendChild(workExperiance);
    });

    let save_btn = document.querySelector('#save');
    save_btn.addEventListener('click', function(event) {
        // to return count 
        let count = document.querySelectorAll('form').length;
        let skills = [];
        for(let i = 1; i <= count; i++) {
            let skilli = `skill${i}`; // let datei = 'date' + i
            let profeciencyi = `profeciency${i}`;
            
            /* Here I am getting elements by ID */
            let skill = document.getElementById(skilli);
            let profeciency = document.getElementById(profeciencyi);
            skills.push({skill: skill.value, profeciency: profeciency.value});
        }
        fetch('/skills', {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(skills), // body data type must match "Content-Type" header
        });
    });
};