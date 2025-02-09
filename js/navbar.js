class Navbar {
    static async loadNavbar(type = 'customer') {
        try {
            // Fetch the navbar template
            const response = await fetch('/components/navbar.html');
            const text = await response.text();

            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = text;

            // Get the appropriate template based on type
            const template = temp.querySelector(`#${type}-navbar`);
            if (!template) {
                throw new Error(`Navbar template for ${type} not found`);
            }

            // Clone the template content
            const content = template.content.cloneNode(true);

            // Get the target element where navbar should be inserted
            const targetElement = document.querySelector('#navbar-container');
            if (!targetElement) {
                console.warn('No #navbar-container found, inserting at body start');
                document.body.insertBefore(content, document.body.firstChild);
            } else {
                targetElement.appendChild(content);
            }

            // Update username
            this.updateUsername(type);

        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    static updateUsername(type) {
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            const storedUsername = localStorage.getItem(type === 'officer' ? 'officerUsername' : 'username');
            usernameElement.textContent = storedUsername || (type === 'officer' ? 'Officer' : 'Customer');
        }
    }
}

// Export for use in other files
window.Navbar = Navbar; 