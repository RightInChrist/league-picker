$(document).ready(function() {
    // Load data from local storage on page load
    loadFromLocalStorage();

    // Initially show Instructions
    showSection('instructions');

    // Handle navigation
    $('#navInstructions').click(function() {
        showSection('instructions');
    });

    $('#navCoaches').click(function() {
        showSection('coaches');
    });

    $('#navTeams').click(function() {
        showSection('teams');
    });

    $('#navPlayers').click(function() {
        showSection('players');
    });

    // Function to show the selected section and hide others
    function showSection(sectionId) {
        $('.section').addClass('d-none'); // Hide all sections
        $('#' + sectionId).removeClass('d-none'); // Show the selected section
        $('.nav-link').removeClass('active'); // Remove active class from all nav links
        $('#nav' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1)).addClass('active'); // Set active class
    }

    // Handle adding coaches
    $('#addCoachForm').submit(function(event) {
        event.preventDefault();
        const coachName = $('#coachName').val().trim();
        if (coachName) {
            addCoach(coachName);
            $('#coachName').val(''); // Clear the input field
            saveToLocalStorage(); // Save data to local storage
        }
    });

    // Function to add a coach to the list
    function addCoach(name) {
        $('#coachesList').append(`
            <li class="list-group-item">
                <span class="coach-name">${name}</span>
                <button class="btn btn-sm btn-warning edit-coach-btn">Edit</button>
            </li>
        `);
    }

    // Handle editing coach names
    $('#coachesList').on('click', '.edit-coach-btn', function() {
        const coachName = $(this).siblings('.coach-name').text();
        $('#editCoachName').val(coachName);
        $('#editCoachForm').removeClass('d-none');
        $(this).closest('li').remove();
    });

    $('#editCoachForm').submit(function(event) {
        event.preventDefault();
        const newName = $('#editCoachName').val().trim();
        if (newName) {
            addCoach(newName);
            $('#editCoachForm').addClass('d-none');
            saveToLocalStorage(); // Save data to local storage
        }
    });

    // Handle adding teams
    $('#assignTeamsForm').submit(function(event) {
        event.preventDefault();
        const teamName = $('#teamName').val().trim();
        const teamColor = $('#teamColor').val();
        if (teamName) {
            addTeam(teamName, teamColor);
            $('#teamName').val(''); // Clear the input field
            $('#teamColor').val('#000000'); // Reset color picker
            saveToLocalStorage(); // Save data to local storage
        }
    });

    // Function to add a team to the list
    function addTeam(name, color) {
        $('#teamsList').append(`
            <li class="list-group-item" style="background-color: ${color}; color: #fff;">
                ${name} <span class="badge badge-light" style="background-color: ${color};">Color</span>
            </li>
        `);
    }

    // Function to add a team to the list
    function addTeam(name, color) {
        $('#teamsList').append(`
            <li class="list-group-item" style="background-color: ${color}; color: #fff;">
                ${name} <span class="badge badge-light" style="background-color: ${color};">Color</span>
            </li>
        `);
    }

    // Handle adding players
    $('#playersTable').on('blur', 'td', function() {
        saveToLocalStorage(); // Save data to local storage on player data change
    });

    // Function to save data to local storage
    function saveToLocalStorage() {
        const coaches = [];
        $('#coachesList .coach-name').each(function() {
            coaches.push($(this).text());
        });

        const teams = [];
        $('#teamsList .list-group-item').each(function() {
            const name = $(this).contents().get(0).nodeValue.trim();
            const color = $(this).find('.badge').css('background-color');
            teams.push({ name: name, color: color });
        });

        const players = [];
        $('#playersTable tbody tr').each(function() {
            const playerName = $(this).find('td').eq(0).text().trim();
            const score = $(this).find('td').eq(1).text().trim();
            players.push({ name: playerName, score: score });
        });

        localStorage.setItem('coaches', JSON.stringify(coaches));
        localStorage.setItem('teams', JSON.stringify(teams));
        localStorage.setItem('players', JSON.stringify(players));
    }

    // Function to load data from local storage
    function loadFromLocalStorage() {
        const coaches = JSON.parse(localStorage.getItem('coaches') || '[]');
        const teams = JSON.parse(localStorage.getItem('teams') || '[]');
        const players = JSON.parse(localStorage.getItem('players') || '[]');

        coaches.forEach(name => addCoach(name));
        teams.forEach(team => addTeam(team.name, team.color));
        players.forEach(player => addPlayer(player.name, player.score));
    }

    // Function to add a player to the table
    function addPlayer(name, score) {
        $('#playersTable tbody').append(`
            <tr>
                <td contenteditable="true">${name}</td>
                <td contenteditable="true">${score}</td>
            </tr>
        `);
    }
});
