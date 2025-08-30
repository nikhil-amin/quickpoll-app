# Create Next.js project
npx create-next-app@latest quickpoll-app

# When prompted, choose:
# Would you like to use TypeScript? → No
# Would you like to use ESLint? → Yes  
# Would you like to use Tailwind CSS? → Yes
# Would you like to use src/ directory? → Yes
# Would you like to use App Router? → Yes
# Would you like to customize the default import alias? → No

# Navigate to project
cd quickpoll-app

# Install Appwrite SDK
npm install appwrite@15.0.0

# Install additional dependencies
npm install react-qr-code qrcode.js uuid chart.js react-chartjs-2 lucide-react

# .env.local
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID  
NEXT_PUBLIC_APPWRITE_POLLS_COLLECTION_ID=YOUR_POLLS_COLLECTION_ID
NEXT_PUBLIC_APPWRITE_OPTIONS_COLLECTION_ID=YOUR_OPTIONS_COLLECTION_ID
NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID=YOUR_VOTES_COLLECTION_ID

# Install globally
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Initialize project in your app directory
appwrite init project

# Initialize function
appwrite init function
