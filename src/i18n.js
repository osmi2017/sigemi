// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "username": "Username",
      "email": "Email",
      "first_name": "First Name",
      "last_name": "Last Name",
      "is_active": "Active",
      "date_joined": "Date Joined",
      "last_login":  "Last login",
      "Oui":"Yes",
      "is_superuser": "Superuser",
      "connexion": "You are offline. Please check your internet connection.",
      "search":"Search...",
      "password":"Password",
      button:{
        "submit":"Submit",
        "update":"Update"
      },
      module:{
        user:{
          "name":"User",
          "name1": "User",
          "name2": "Users"
        }
      },
      msg:{
        "saved":"Saved!",
        "updated": "Updated!",
        "deleted": "Deleted!",
        "not": "not"
      }
    }
  },
  fr: {
    translation: {
      "username": "Nom d'utilisateur",
      "email": "E-mail",
      "first_name": "Prénoms",
      "last_name": "Nom de famille",
      "is_active": "Actif",
      "date_joined": "Date d'inscription",
      "last_login":  "Dernière connection",
      "Yes":"Oui",
      "is_superuser": "Superadmin",
      "connexion":"Vous n'êtes plus connecté à internet. Vérifiez votre connection",
      "search":"Rechercher...",
      "password":"Mot de passe",
      button:{
        "submit":"Valider",
        "update":"Modifier"
      },
      module:{
        user:{
          "name":"Utilisateur",
          "name1": "L'utilisateur",
          "name2": "Les utilisateurs"
        }
      },
      msg:{
        "saved":"Enreristré!",
        "updated": "Modifié!",
        "deleted": "Supprimé!",
        "not": "non"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
