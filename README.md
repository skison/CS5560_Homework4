### CS5560 Midterm - Samuel Kison
This MEAN application allows users to store username-password combinations for specific domains in their own personal 'vaults'. For the purposes of this assignment, I refer to these combinations as 'credentials'.

More specifically, this application fulfills these features:
* Users can sign up, sign in, and sign out
* Vault features are protected and require local authentication to be displayed
* Only the credentials that are relevant to the authenticated user are displayed
* Provides users the capability to create and delete domains; allows users to confirm deletion of a chosen domain
* Provides users the capability to create and delete credentials under a given fomain; allows users to confirm deletion of any chosen credentials
* Users can select any of their saved domains from a dropdown menus, which shows their associated credentials
* Credentials under a domain are displayed in a table; additionally, they are hidden when first loaded up, and can individually be shown
* Credentials are saved in a MongoDB database to store data after application restarts

### Base Code From
https://github.com/DavideViolante/Angular-Full-Stack
### Base Code Author
* [Davide Violante](https://github.com/DavideViolante)
