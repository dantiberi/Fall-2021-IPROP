# Development Database Setup

## Step 1: Install Microsoft SQL Server Express

Go to the [Microsoft SQL Server Downloads Page](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) and click on "Download now" underneath "Express" in the "Or, download a free specialized edition". 

Run the installer. Select the "Basic" installation type. At the end of the installation, it should tell you what your Connection String is. Copy this value and save it somewhere.

## Step 2: Install Microsoft SQL Server Management Studio (SSMS)

If you don't already have SSM, go [here](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15) and select "Free Download for SQL Server Management Studio (SSMS)". Install it.

## Step 3: Set up local Jebra Database

Open up Microsoft SQL Server Management Studio (SSMS). Upon opening it, it should prompt you for a server to connect to. If there's nothing in the "Server name" field, click on the expand arrow on the right side of that input field and select "Browse for more". In Local Servers, expand the "Database Engine" item and your SQL Express server should appear in there. Select it and click "OK". Then, click "Connect".

In the Object Explorer (on the left side of the screen), right click the "Databases" folder and select "New Database...". In Database Name, type in "Jebra" and click "OK".

In SSMS, open the `JebraDBSetup.sql` script in the same directory as this markdown file (Make sure you have pulled from GitHub beforehand!). Click "Execute" at the top. This script populates the database with the tables and relations that Jebra uses, as well as some sample subjects / questions. **Note: This file may be changed as time goes on, so make sure to re-run this script when possible to make sure your database structure is up to date.**

Your Connection string that you copied from Step 1 should look something like this: `Server=localhost\SQLEXPRESS;Database=master;Trusted_Connection=True;` Change the `Database=master` (or whatever the default Database value is) to `Database=Jebra`.

## Step 4: Configure JebraAzureFunctions environment

Open up `JebraAzureFunctions.sln` in Visual Studio. Create a file named `local.settings.json` (this file is in `.gitignore` by default since it's typically a place where people put personal config settings, so you'd usually not want that checked into Git, so that's I'm having you make it yourself here.). The contents of this file should be as follows:

```{json}
{
  "exclude": [
    "**/bin",
    "**/bower_components",
    "**/jspm_packages",
    "**/node_modules",
    "**/obj",
    "**/platforms"
  ],
  "IsEncrypted": false,
  "Values": {
    "SqlConnectionString": "<YOUR CONNECTION STRING HERE>"
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*"
  }
}
```

Replace `<YOUR CONNECTION STRING HERE>` in the above with your connection string. Make sure that any backslashes (`\`) are replaced with double backslashes (`\\`) so they aren't interpreted as escape characters (Visual Studio might automatically do this for you).

In the second dropdown to the left of the green play button in the top bar, make sure it is set to "Debug".

## Step 5: Test it out!

Click on the green play button to run JebraAzureFunctions locally. It should connect to your local SQL Express database.

Then, run `npm start` on the `client-app` directory, and verify that it connects and works as expected.