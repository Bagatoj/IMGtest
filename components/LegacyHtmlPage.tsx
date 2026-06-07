"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "./LanguageProvider";
import { t, type Lang } from "@/lib/i18n";
import { readCart } from "@/lib/cart";

const legacyText: Record<Lang, Record<string, string>> = {
  fr: {},
  nl: {
    "Accueil": "Home", "Réalisations": "Realisaties", "Contact": "Contact", "Demande de devis": "Offerte aanvragen", "Panier": "Winkelmand",
    "FAQ général": "Algemene FAQ", "FAQ Général": "Algemene FAQ", "Bâtiment": "Bouw", "Location": "Verhuur", "Espaces verts": "Groene ruimtes",
    "Vos travaux, des solutions de location et vos espaces verts": "Uw werken, verhuuroplossingen en groene ruimtes",
    "Location matériel": "Materiaalverhuur", "Entretien des espaces verts": "Onderhoud van groene ruimtes", "Demander un devis": "Offerte aanvragen",
  },
  en: {
    "Accueil": "Home", "Réalisations": "Projects", "Contact": "Contact", "Demande de devis": "Request a quote", "Panier": "Cart",
    "FAQ général": "General FAQ", "FAQ Général": "General FAQ", "Bâtiment": "Building", "Location": "Rental", "Espaces verts": "Green spaces",
    "Vos travaux, des solutions de location et vos espaces verts": "Your works, rental solutions and green spaces",
    "Location matériel": "Equipment rental", "Entretien des espaces verts": "Green space maintenance", "Demander un devis": "Request a quote",
  }
};

const extraLegacyText: Record<Lang, Record<string, string>> = {
  fr: {},
  nl: {
    "Les réponses aux questions les plus fréquentes concernant les travaux, la location de matériel et l’entretien des espaces verts.": "Antwoorden op de meest gestelde vragen over werken, materiaalverhuur en onderhoud van groene ruimtes.",
    "Comment faire une demande efficacement ?": "Hoe dien ik efficiënt een aanvraag in?",
    "Le plus simple est d’envoyer un message écrit, idéalement sur WhatsApp, avec le type de demande, la commune, quelques photos, les dimensions approximatives et les délais souhaités.": "Het eenvoudigst is een geschreven bericht te sturen, bij voorkeur via WhatsApp, met het type aanvraag, de gemeente, enkele foto’s, de geschatte afmetingen en de gewenste timing.",
    "Puis-je appeler directement ?": "Kan ik rechtstreeks bellen?",
    "Les messages sont prioritaires afin de garder une trace claire de la demande. Si nécessaire, je vous recontacterai moi-même par téléphone.": "Berichten krijgen voorrang zodat de aanvraag duidelijk bewaard blijft. Indien nodig neem ik zelf telefonisch contact met u op.",
    "Dois-je envoyer des photos ?": "Moet ik foto’s sturen?",
    "Oui, si possible. Les photos permettent de mieux comprendre le travail à réaliser, d’éviter les malentendus et de préparer une réponse plus précise.": "Ja, indien mogelijk. Foto’s helpen om het werk beter te begrijpen, misverstanden te vermijden en een nauwkeuriger antwoord voor te bereiden.",
    "Quelles informations dois-je envoyer dans mon message ?": "Welke informatie moet ik in mijn bericht zetten?",
    "Indiquez le type de service souhaité, la commune, les dimensions approximatives, les délais souhaités et ajoutez des photos si possible. Plus la demande est complète, plus la réponse sera précise.": "Vermeld het gewenste type dienst, de gemeente, geschatte afmetingen, gewenste timing en voeg indien mogelijk foto’s toe. Hoe vollediger de aanvraag, hoe nauwkeuriger het antwoord.",
    "Quel est le meilleur moyen de contact ?": "Wat is de beste manier om contact op te nemen?",
    "Le contact par message est recommandé, idéalement via WhatsApp. Cela permet d’envoyer des photos, de garder une trace claire de la demande et d’éviter les oublis.": "Contact per bericht wordt aanbevolen, bij voorkeur via WhatsApp. Zo kunt u foto’s sturen, blijft de aanvraag duidelijk bewaard en worden zaken niet vergeten.",
    "Dans quel délai puis-je recevoir une réponse ?": "Binnen welke termijn krijg ik antwoord?",
    "Les demandes sont traitées dès que possible. Le délai de réponse peut varier selon l’activité, l’urgence de la demande et les informations fournies.": "Aanvragen worden zo snel mogelijk behandeld. De antwoordtermijn hangt af van de drukte, de urgentie en de verstrekte informatie.",
    "Quels types de travaux sont concernés ?": "Welke soorten werken zijn mogelijk?",
    "La page bâtiment présentera les services de rénovation, aménagement, interventions intérieures et travaux selon les besoins du client.": "De bouwpagina zal renovatie, inrichting, binnenwerken en werken volgens de behoeften van de klant presenteren.",
    "Comment demander un devis travaux ?": "Hoe vraag ik een offerte voor werken aan?",
    "Vous pouvez passer par la page contact avec un descriptif clair, des photos, la commune et les délais souhaités. Un échange permettra ensuite d’affiner la demande.": "U kunt via de contactpagina een duidelijke omschrijving, foto’s, gemeente en gewenste timing doorgeven. Daarna kan de aanvraag verder worden verfijnd.",
    "Une visite est-elle nécessaire avant un devis ?": "Is een bezoek nodig vóór een offerte?",
    "Pour certains travaux, une visite ou un échange détaillé avec photos sera nécessaire afin de comprendre correctement la demande et les contraintes du chantier.": "Voor bepaalde werken is een bezoek of een gedetailleerde uitwisseling met foto’s nodig om de aanvraag en de beperkingen van de werf goed te begrijpen.",
    "Puis-je demander plusieurs types de travaux en même temps ?": "Kan ik meerdere soorten werken tegelijk aanvragen?",
    "Oui. Vous pouvez regrouper plusieurs besoins dans une seule demande : peinture, rénovation, petits travaux, aménagement ou autre intervention liée au bâtiment.": "Ja. U kunt meerdere behoeften in één aanvraag bundelen: schilderwerken, renovatie, kleine werken, inrichting of andere bouwinterventies.",
    "Les délais sont-ils garantis ?": "Zijn termijnen gegarandeerd?",
    "Les délais dépendent de la disponibilité, du type de demande et des contraintes du chantier. Une estimation pourra être donnée après analyse de la demande.": "Termijnen hangen af van beschikbaarheid, het type aanvraag en de werfbeperkingen. Na analyse kan een raming worden gegeven.",
    "Le catalogue de location est-il déjà disponible ?": "Is de verhuurcatalogus al beschikbaar?",
    "Le catalogue complet sera ajouté dans une prochaine étape. Il comprendra les machines, les quantités disponibles, les disponibilités par date, la recherche et les filtres.": "De volledige catalogus wordt in een volgende stap toegevoegd. Hij bevat machines, beschikbare hoeveelheden, beschikbaarheid per datum, zoekfunctie en filters.",
    "Comment fonctionnera la disponibilité des machines ?": "Hoe werkt de beschikbaarheid van machines?",
    "Chaque outil aura un stock et un planning. Si une machine est déjà louée sur une période, le site indiquera la disponibilité restante ou la prochaine date possible.": "Elke machine krijgt een voorraad en planning. Als een machine al verhuurd is, toont de site de resterende beschikbaarheid of de volgende mogelijke datum.",
    "Pourrai-je réserver directement en ligne ?": "Kan ik rechtstreeks online reserveren?",
    "Oui. L’objectif est de permettre une demande de réservation en ligne, avec validation finale. Le client pourra aussi me contacter directement si nécessaire. Une gestion interne permettra de confirmer ou refuser selon les disponibilités réelles.": "Ja. Het doel is een online reservatieaanvraag met eindvalidatie. De klant kan ook rechtstreeks contact opnemen. Intern beheer maakt bevestiging of weigering mogelijk volgens de echte beschikbaarheid.",
    "Le stock affiché sera-t-il mis à jour automatiquement ?": "Wordt de getoonde voorraad automatisch bijgewerkt?",
    "L’objectif est que le stock tienne compte des réservations faites en ligne, mais aussi des locations encodées manuellement lorsque du matériel est réservé directement hors site.": "Het doel is dat de voorraad rekening houdt met online reservaties en met manueel ingevoerde verhuur wanneer materiaal buiten de site om gereserveerd wordt.",
    "Pourrai-je connaître la prochaine disponibilité d’une machine ?": "Kan ik de volgende beschikbaarheid van een machine zien?",
    "Oui. Si une machine est déjà louée, le site devra pouvoir indiquer la prochaine date disponible afin que le client puisse anticiper sa réservation.": "Ja. Als een machine al verhuurd is, moet de site de volgende beschikbare datum tonen zodat de klant kan plannen.",
    "Y aura-t-il une caution pour le matériel ?": "Is er een waarborg voor het materiaal?",
    "Les conditions de caution, de retour, de retard ou de casse seront précisées dans les fiches produits et dans les conditions de location lorsque le catalogue sera finalisé.": "Voorwaarden rond waarborg, terugbreng, vertraging of schade worden vermeld op de productfiches en in de verhuurvoorwaarden zodra de catalogus klaar is.",
    "Comment réserver une prestation d’espaces verts ?": "Hoe reserveer ik onderhoud van groene ruimtes?",
    "Vous pouvez me contacter via le site, par message/SMS ou directement via Ring Twice. Dans tous les cas, pour les prestations d’espaces verts, le paiement final passera par Ring Twice.": "U kunt contact opnemen via de site, bericht/SMS of rechtstreeks via Ring Twice. Voor groene diensten verloopt de eindbetaling via Ring Twice.",
    "Faut-il créer un compte Ring Twice ?": "Moet ik een Ring Twice-account aanmaken?",
    "Oui, un compte Ring Twice sera nécessaire pour accéder au service et finaliser la demande de prestation.": "Ja, een Ring Twice-account is nodig om de dienst te gebruiken en de aanvraag te finaliseren.",
    "Un devis est-il possible avant intervention ?": "Is een offerte mogelijk vóór de interventie?",
    "Oui. Si nécessaire, je peux venir évaluer le travail à réaliser avant la prestation. Le règlement final devra cependant passer par Ring Twice.": "Ja. Indien nodig kan ik het werk vooraf komen beoordelen. De eindbetaling verloopt wel via Ring Twice.",
    "Quelle est la zone d’intervention ?": "Wat is de interventiezone?",
    "J’interviens principalement sur Bruxelles et les alentours. Selon la nature de la demande, le volume du chantier et l’organisation nécessaire, une intervention peut être étudiée ailleurs en Belgique.": "Ik werk vooral in Brussel en omgeving. Afhankelijk van de aanvraag, omvang en organisatie kan een interventie elders in België bekeken worden.",
    "Quels travaux d’espaces verts sont possibles ?": "Welke groene werken zijn mogelijk?",
    "Les demandes peuvent concerner la tonte, la taille de haies, le débroussaillage, le nettoyage extérieur, la remise en état de jardin, la préparation de terrain ou encore la pose de pelouse.": "Aanvragen kunnen gaan over maaien, haagtrimmen, bosmaaien, buitenreiniging, tuinherstel, terreinvoorbereiding of grasaanleg.",
    "Dois-je passer par Ring Twice pour un simple renseignement ?": "Moet ik via Ring Twice gaan voor een eenvoudige vraag?",
    "Non. Vous pouvez d’abord me contacter via le site, WhatsApp ou SMS pour obtenir une information. Pour la prestation finale d’espaces verts, le paiement passera par Ring Twice.": "Nee. U kunt eerst via de site, WhatsApp of SMS contact opnemen voor informatie. Voor de uiteindelijke groene dienst verloopt de betaling via Ring Twice.",
    "Est-ce possible de faire une visite avant le travail ?": "Is een bezoek vooraf mogelijk?",
    "Oui, si la demande le nécessite, une visite ou une estimation préalable peut être organisée afin d’évaluer correctement le travail à réaliser.": "Ja, indien nodig kan een bezoek of voorafgaande inschatting worden georganiseerd om het werk correct te beoordelen.",
    "Vous ne trouvez pas votre réponse ?": "Vindt u uw antwoord niet?",
    "Envoyez un message avec les informations essentielles, de préférence via WhatsApp.": "Stuur een bericht met de belangrijkste informatie, bij voorkeur via WhatsApp.",
    "Me contacter": "Contact opnemen",
    "Découvrez les travaux et interventions réalisés par catégorie.": "Ontdek uitgevoerde werken en interventies per categorie.",
    "Bâtiment & rénovation": "Bouw & renovatie",
    "Les photos de réalisations bâtiment/rénovation seront ajoutées ici dès que nous aurons les visuels adaptés.": "Foto’s van bouw- en renovatieprojecten worden hier toegevoegd zodra de juiste beelden beschikbaar zijn.",
    "Pour une demande claire et rapide, privilégiez un message écrit avec toutes les informations essentielles.": "Voor een duidelijke en snelle aanvraag geeft u best de voorkeur aan een geschreven bericht met alle essentiële informatie.",
    "Coordonnées": "Contactgegevens", "Société": "Bedrijf", "Téléphone": "Telefoon", "E-mail": "E-mail", "Numéro de TVA": "Btw-nummer",
    "Important :": "Belangrijk:",
    "merci d’envoyer un message en priorité, idéalement via WhatsApp. Indiquez directement le type de demande, la commune, les photos si possible, les dimensions approximatives, les délais souhaités et toute contrainte importante.": "stuur bij voorkeur een bericht, idealiter via WhatsApp. Vermeld meteen het type aanvraag, de gemeente, indien mogelijk foto’s, geschatte afmetingen, gewenste timing en belangrijke beperkingen.",
    "Envoyer un message WhatsApp": "WhatsApp-bericht sturen", "Envoyer un e-mail": "E-mail sturen", "Envoyer un SMS": "SMS sturen",
    "Préparer votre demande": "Uw aanvraag voorbereiden",
    "Type de demande : bâtiment, location de matériel ou espaces verts": "Type aanvraag: bouw, materiaalverhuur of groene ruimtes",
    "Votre commune / zone d’intervention": "Uw gemeente / interventiezone", "Description courte du besoin": "Korte beschrijving van de behoefte",
    "Photos ou informations utiles à envoyer via WhatsApp ou e-mail": "Foto’s of nuttige informatie via WhatsApp of e-mail sturen",
    "Les champs ci-dessus servent d’exemple pour préparer votre demande. Pour accéder au vrai formulaire de demande de devis, cliquez sur le bouton ci-dessous.": "De velden hierboven helpen om uw aanvraag voor te bereiden. Klik op de knop hieronder voor het echte offerteformulier.",
    "Accéder au formulaire de devis": "Naar het offerteformulier",
    "L’adresse privée n’est pas affichée publiquement sur cette page. Le numéro de TVA est indiqué ci-dessus pour l’identification professionnelle de la société.": "Het privéadres wordt niet publiek getoond. Het btw-nummer staat hierboven voor professionele identificatie van het bedrijf.",
    "← Retour aux locations": "← Terug naar verhuur", "Vider tout le panier": "Winkelmand leegmaken", "Machines sélectionnées": "Geselecteerde machines", "Total estimé : 0 € HTVA": "Geschat totaal: 0 € excl. btw",
    "Coordonnées et livraison": "Gegevens en levering", "Vous êtes": "U bent", "Particulier": "Particulier", "Nom complet": "Volledige naam", "Adresse de livraison": "Leveringsadres", "Ville": "Stad", "Choisir une ville": "Kies een stad", "Autre ville": "Andere stad", "Durée souhaitée": "Gewenste duur", "Choisir une durée": "Kies een duur", "1 jour": "1 dag", "1 semaine": "1 week", "2 semaines": "2 weken", "3 semaines": "3 weken", "4 semaines": "4 weken", "Distance aller simple depuis Bruxelles, en km": "Enkele afstand vanaf Brussel, in km", "Indiquez une ville ou une distance pour estimer la livraison. Calcul en aller-retour.": "Vermeld een stad of afstand om levering te ramen. Berekening heen en terug.", "Message": "Bericht", "Envoyer la demande": "Aanvraag verzenden"
  },
  en: {
    "Les réponses aux questions les plus fréquentes concernant les travaux, la location de matériel et l’entretien des espaces verts.": "Answers to the most common questions about works, equipment rental and green space maintenance.",
    "Comment faire une demande efficacement ?": "How can I make an efficient request?", "Le plus simple est d’envoyer un message écrit, idéalement sur WhatsApp, avec le type de demande, la commune, quelques photos, les dimensions approximatives et les délais souhaités.": "The easiest way is to send a written message, ideally on WhatsApp, with the request type, town, a few photos, approximate dimensions and desired timing.",
    "Puis-je appeler directement ?": "Can I call directly?", "Les messages sont prioritaires afin de garder une trace claire de la demande. Si nécessaire, je vous recontacterai moi-même par téléphone.": "Messages are prioritized to keep a clear record of the request. If needed, I will call you back myself.",
    "Dois-je envoyer des photos ?": "Should I send photos?", "Oui, si possible. Les photos permettent de mieux comprendre le travail à réaliser, d’éviter les malentendus et de préparer une réponse plus précise.": "Yes, if possible. Photos help understand the work, avoid misunderstandings and prepare a more accurate answer.",
    "Quelles informations dois-je envoyer dans mon message ?": "What information should I send?", "Indiquez le type de service souhaité, la commune, les dimensions approximatives, les délais souhaités et ajoutez des photos si possible. Plus la demande est complète, plus la réponse sera précise.": "Mention the service type, town, approximate dimensions, desired timing and add photos if possible. The more complete the request, the more accurate the reply.",
    "Quel est le meilleur moyen de contact ?": "What is the best contact method?", "Le contact par message est recommandé, idéalement via WhatsApp. Cela permet d’envoyer des photos, de garder une trace claire de la demande et d’éviter les oublis.": "Messaging is recommended, ideally via WhatsApp. It lets you send photos, keeps a clear record and avoids omissions.",
    "Dans quel délai puis-je recevoir une réponse ?": "How quickly can I get an answer?", "Les demandes sont traitées dès que possible. Le délai de réponse peut varier selon l’activité, l’urgence de la demande et les informations fournies.": "Requests are handled as soon as possible. Response time may vary depending on activity, urgency and information provided.",
    "Quels types de travaux sont concernés ?": "What types of works are covered?", "La page bâtiment présentera les services de rénovation, aménagement, interventions intérieures et travaux selon les besoins du client.": "The building page will present renovation, fitting-out, interior interventions and works according to customer needs.",
    "Comment demander un devis travaux ?": "How do I request a works quote?", "Vous pouvez passer par la page contact avec un descriptif clair, des photos, la commune et les délais souhaités. Un échange permettra ensuite d’affiner la demande.": "Use the contact page with a clear description, photos, town and desired timing. A follow-up exchange will refine the request.",
    "Une visite est-elle nécessaire avant un devis ?": "Is a visit needed before a quote?", "Pour certains travaux, une visite ou un échange détaillé avec photos sera nécessaire afin de comprendre correctement la demande et les contraintes du chantier.": "For some works, a visit or detailed exchange with photos is needed to understand the request and site constraints properly.",
    "Puis-je demander plusieurs types de travaux en même temps ?": "Can I request several types of work at once?", "Oui. Vous pouvez regrouper plusieurs besoins dans une seule demande : peinture, rénovation, petits travaux, aménagement ou autre intervention liée au bâtiment.": "Yes. You can group several needs in one request: painting, renovation, small works, fitting-out or other building-related intervention.",
    "Les délais sont-ils garantis ?": "Are deadlines guaranteed?", "Les délais dépendent de la disponibilité, du type de demande et des contraintes du chantier. Une estimation pourra être donnée après analyse de la demande.": "Deadlines depend on availability, request type and site constraints. An estimate can be given after reviewing the request.",
    "Le catalogue de location est-il déjà disponible ?": "Is the rental catalogue already available?", "Le catalogue complet sera ajouté dans une prochaine étape. Il comprendra les machines, les quantités disponibles, les disponibilités par date, la recherche et les filtres.": "The full catalogue will be added in a next step. It will include machines, available quantities, date availability, search and filters.",
    "Comment fonctionnera la disponibilité des machines ?": "How will machine availability work?", "Chaque outil aura un stock et un planning. Si une machine est déjà louée sur une période, le site indiquera la disponibilité restante ou la prochaine date possible.": "Each tool will have stock and a schedule. If a machine is already rented, the site will show remaining availability or the next possible date.",
    "Pourrai-je réserver directement en ligne ?": "Can I book directly online?", "Oui. L’objectif est de permettre une demande de réservation en ligne, avec validation finale. Le client pourra aussi me contacter directement si nécessaire. Une gestion interne permettra de confirmer ou refuser selon les disponibilités réelles.": "Yes. The goal is to allow online booking requests with final validation. Customers can also contact me directly if needed. Internal management will confirm or refuse based on real availability.",
    "Le stock affiché sera-t-il mis à jour automatiquement ?": "Will displayed stock update automatically?", "L’objectif est que le stock tienne compte des réservations faites en ligne, mais aussi des locations encodées manuellement lorsque du matériel est réservé directement hors site.": "The goal is for stock to account for online bookings and manually entered rentals when equipment is booked directly outside the site.",
    "Pourrai-je connaître la prochaine disponibilité d’une machine ?": "Can I see the next availability date?", "Oui. Si une machine est déjà louée, le site devra pouvoir indiquer la prochaine date disponible afin que le client puisse anticiper sa réservation.": "Yes. If a machine is already rented, the site should show the next available date so the customer can plan.",
    "Y aura-t-il une caution pour le matériel ?": "Will there be a deposit?", "Les conditions de caution, de retour, de retard ou de casse seront précisées dans les fiches produits et dans les conditions de location lorsque le catalogue sera finalisé.": "Deposit, return, delay and damage conditions will be specified on product pages and rental terms once the catalogue is finalized.",
    "Comment réserver une prestation d’espaces verts ?": "How do I book green space maintenance?", "Vous pouvez me contacter via le site, par message/SMS ou directement via Ring Twice. Dans tous les cas, pour les prestations d’espaces verts, le paiement final passera par Ring Twice.": "You can contact me via the site, message/SMS or directly via Ring Twice. For green space services, final payment goes through Ring Twice.",
    "Faut-il créer un compte Ring Twice ?": "Do I need a Ring Twice account?", "Oui, un compte Ring Twice sera nécessaire pour accéder au service et finaliser la demande de prestation.": "Yes, a Ring Twice account is needed to access the service and finalize the request.",
    "Un devis est-il possible avant intervention ?": "Is a quote possible before intervention?", "Oui. Si nécessaire, je peux venir évaluer le travail à réaliser avant la prestation. Le règlement final devra cependant passer par Ring Twice.": "Yes. If needed, I can assess the work before the service. Final payment must still go through Ring Twice.",
    "Quelle est la zone d’intervention ?": "What is the service area?", "J’interviens principalement sur Bruxelles et les alentours. Selon la nature de la demande, le volume du chantier et l’organisation nécessaire, une intervention peut être étudiée ailleurs en Belgique.": "I mainly work in Brussels and nearby areas. Depending on request type, job size and organization, intervention elsewhere in Belgium can be considered.",
    "Quels travaux d’espaces verts sont possibles ?": "What green space jobs are possible?", "Les demandes peuvent concerner la tonte, la taille de haies, le débroussaillage, le nettoyage extérieur, la remise en état de jardin, la préparation de terrain ou encore la pose de pelouse.": "Requests can include mowing, hedge trimming, brush cutting, outdoor cleaning, garden restoration, ground preparation or lawn laying.",
    "Dois-je passer par Ring Twice pour un simple renseignement ?": "Do I need Ring Twice for simple information?", "Non. Vous pouvez d’abord me contacter via le site, WhatsApp ou SMS pour obtenir une information. Pour la prestation finale d’espaces verts, le paiement passera par Ring Twice.": "No. You can first contact me via the site, WhatsApp or SMS for information. For the final green space service, payment will go through Ring Twice.",
    "Est-ce possible de faire une visite avant le travail ?": "Can there be a visit before the work?", "Oui, si la demande le nécessite, une visite ou une estimation préalable peut être organisée afin d’évaluer correctement le travail à réaliser.": "Yes, if the request requires it, a visit or prior estimate can be arranged to properly assess the work.",
    "Vous ne trouvez pas votre réponse ?": "Can’t find your answer?", "Envoyez un message avec les informations essentielles, de préférence via WhatsApp.": "Send a message with the essential information, preferably via WhatsApp.", "Me contacter": "Contact me",
    "Découvrez les travaux et interventions réalisés par catégorie.": "Discover works and interventions by category.", "Bâtiment & rénovation": "Building & renovation", "Les photos de réalisations bâtiment/rénovation seront ajoutées ici dès que nous aurons les visuels adaptés.": "Building/renovation project photos will be added here once suitable visuals are available.",
    "Pour une demande claire et rapide, privilégiez un message écrit avec toutes les informations essentielles.": "For a clear and quick request, prefer a written message with all essential information.", "Coordonnées": "Contact details", "Société": "Company", "Téléphone": "Phone", "E-mail": "Email", "Numéro de TVA": "VAT number", "Important :": "Important:",
    "merci d’envoyer un message en priorité, idéalement via WhatsApp. Indiquez directement le type de demande, la commune, les photos si possible, les dimensions approximatives, les délais souhaités et toute contrainte importante.": "please send a message first, ideally via WhatsApp. Directly mention the request type, town, photos if possible, approximate dimensions, desired timing and any important constraints.",
    "Envoyer un message WhatsApp": "Send a WhatsApp message", "Envoyer un e-mail": "Send an email", "Envoyer un SMS": "Send an SMS", "Préparer votre demande": "Prepare your request", "Type de demande : bâtiment, location de matériel ou espaces verts": "Request type: building, equipment rental or green spaces", "Votre commune / zone d’intervention": "Your town / service area", "Description courte du besoin": "Short description of the need", "Photos ou informations utiles à envoyer via WhatsApp ou e-mail": "Useful photos or information to send via WhatsApp or email", "Les champs ci-dessus servent d’exemple pour préparer votre demande. Pour accéder au vrai formulaire de demande de devis, cliquez sur le bouton ci-dessous.": "The fields above are examples to prepare your request. To access the real quote request form, click the button below.", "Accéder au formulaire de devis": "Go to quote form", "L’adresse privée n’est pas affichée publiquement sur cette page. Le numéro de TVA est indiqué ci-dessus pour l’identification professionnelle de la société.": "The private address is not publicly displayed. The VAT number is shown above for professional company identification.",
    "← Retour aux locations": "← Back to rentals", "Vider tout le panier": "Empty cart", "Machines sélectionnées": "Selected machines", "Total estimé : 0 € HTVA": "Estimated total: €0 excl. VAT", "Coordonnées et livraison": "Details and delivery", "Vous êtes": "You are", "Particulier": "Private person", "Nom complet": "Full name", "Adresse de livraison": "Delivery address", "Ville": "City", "Choisir une ville": "Choose a city", "Autre ville": "Other city", "Durée souhaitée": "Desired duration", "Choisir une durée": "Choose a duration", "1 jour": "1 day", "1 semaine": "1 week", "2 semaines": "2 weeks", "3 semaines": "3 weeks", "4 semaines": "4 weeks", "Distance aller simple depuis Bruxelles, en km": "One-way distance from Brussels, in km", "Indiquez une ville ou une distance pour estimer la livraison. Calcul en aller-retour.": "Enter a city or distance to estimate delivery. Round-trip calculation.", "Message": "Message", "Envoyer la demande": "Send request"
  }
};

const additionalLegacyText: Record<Lang, Record<string, string>> = {
  fr: {},
  nl: {

    "Services proposés": "Aangeboden diensten",
    "Tonte & entretien": "Maaien & onderhoud",
    "Taille & haies": "Snoeien & hagen",
    "Gros travaux de jardinage": "Grote tuinwerken",
    "Taille de haies, végétation mitoyenne, bambous, lierre et débroussaillage selon le besoin.": "Hagen snoeien, gedeelde begroeiing, bamboe, klimop en bosmaaien volgens de behoefte.",
    "Travaux plus conséquents : utilisation de mini-pelle, préparation de terrain, pose de gazon en rouleau et aménagement extérieur.": "Grotere werken: gebruik van minigraver, terreinvoorbereiding, graszoden plaatsen en buitenaanleg.",
    "Quelques réalisations": "Enkele realisaties",
    "Comment prendre rendez-vous ?": "Hoe maak ik een afspraak?",
    "Comment se passe le paiement ?": "Hoe verloopt de betaling?",
    "Oui, si nécessaire je peux venir évaluer le travail à réaliser avant la prestation.": "Ja, indien nodig kan ik het uit te voeren werk vóór de dienst komen beoordelen.",
    "Me contacter pour plus d’informations": "Contacteer mij voor meer informatie",
    "Envie de voir plus de photos ?": "Wilt u meer foto’s zien?",
    "Voir mon profil": "Mijn profiel bekijken",
    "Voir toutes mes évaluations clients": "Al mijn klantbeoordelingen bekijken",
    "Voir mes évaluations": "Mijn beoordelingen bekijken",
    "SuperTalent": "SuperTalent",
    "34 clients réguliers": "34 vaste klanten",
    "154 évaluations clients": "154 klantbeoordelingen",
    'Espace vert': 'Groene ruimtes',
    'Indiquez le type de service souhaité, la commune, les dimensions approximatives, les délais souhaités et ajoutez des photos si possible. Plus la demande est complète, plus la réponse pourra être précise.': 'Vermeld het gewenste type dienst, de gemeente, geschatte afmetingen, gewenste timing en voeg indien mogelijk foto’s toe. Hoe vollediger de aanvraag, hoe nauwkeuriger het antwoord kan zijn.',
    'Oui. L’objectif est de permettre une demande de réservation en ligne, avec validation finale. Le client pourra aussi me contacter directement si nécessaire. Une gestion interne permettra d’encoder les locations faites hors site afin que le stock reste à jour.': 'Ja. Het doel is een online reserveringsaanvraag met eindvalidatie mogelijk te maken. De klant kan mij indien nodig ook rechtstreeks contacteren. Via intern beheer kunnen verhuurperiodes buiten de site worden ingevoerd zodat de voorraad actueel blijft.',
    'Vous pouvez me contacter via le site, par message/SMS ou directement via Ring Twice. Dans tous les cas, pour les prestations d’espaces verts, le paiement final passera par Ring Twice afin de centraliser et sécuriser la prestation.': 'U kunt contact opnemen via de site, per bericht/SMS of rechtstreeks via Ring Twice. Voor groene diensten verloopt de eindbetaling via Ring Twice om de prestatie te centraliseren en te beveiligen.',
    'J’interviens principalement sur Bruxelles et les alentours. Selon la nature de la demande, le volume du chantier et l’organisation nécessaire, une intervention peut être étudiée ailleurs en Belgique.': 'Ik werk voornamelijk in Brussel en omgeving. Afhankelijk van de aanvraag, de omvang van de werf en de nodige organisatie kan een interventie elders in België bekeken worden.',
    'Les demandes peuvent concerner la tonte, la taille de haies, le débroussaillage, le nettoyage extérieur, la remise en état de jardin, la préparation de terrain ou encore la pose de gazon en rouleau. Cette liste n’est pas exhaustive : d’autres travaux extérieurs peuvent être étudiés selon la demande.': 'Aanvragen kunnen gaan over maaien, hagen snoeien, bosmaaien, buitenreiniging, tuinherstel, terreinvoorbereiding of het plaatsen van graszoden. Deze lijst is niet volledig: andere buitenwerken kunnen volgens de aanvraag bekeken worden.',
    'Non. Vous pouvez d’abord me contacter via le site, WhatsApp ou SMS pour obtenir une information. Pour la prestation finale d’espaces verts, le paiement passera par Ring Twice.': 'Nee. U kunt mij eerst via de site, WhatsApp of SMS contacteren voor informatie. Voor de uiteindelijke groene dienst verloopt de betaling via Ring Twice.',
    'Oui, si la demande le nécessite, une visite ou une estimation préalable peut être organisée afin d’évaluer correctement le travail à réaliser.': 'Ja, indien de aanvraag dit vereist, kan een voorafgaand bezoek of raming georganiseerd worden om het uit te voeren werk correct te beoordelen.',
    'Vous ne trouvez pas votre réponse ?': 'Vindt u uw antwoord niet?',
    'Envoyez un message avec les informations essentielles, de préférence via WhatsApp.': 'Stuur een bericht met de belangrijkste informatie, bij voorkeur via WhatsApp.',
    'Comment faire une demande efficacement ?': 'Hoe dien ik efficiënt een aanvraag in?',
    'Puis-je appeler directement ?': 'Kan ik rechtstreeks bellen?',
    'Dois-je envoyer des photos ?': 'Moet ik foto’s sturen?',
    'Quelles informations dois-je envoyer dans mon message ?': 'Welke informatie moet ik in mijn bericht zetten?',
    'Quel est le meilleur moyen de contact ?': 'Wat is de beste manier om contact op te nemen?',
    'Dans quel délai puis-je recevoir une réponse ?': 'Binnen welke termijn krijg ik antwoord?',
    'Quels types de travaux sont concernés ?': 'Welke soorten werken zijn mogelijk?',
    'Comment demander un devis travaux ?': 'Hoe vraag ik een offerte voor werken aan?',
    'Une visite est-elle nécessaire avant un devis ?': 'Is een bezoek nodig vóór een offerte?',
    'Puis-je demander plusieurs types de travaux en même temps ?': 'Kan ik meerdere soorten werken tegelijk aanvragen?',
    'Les délais sont-ils garantis ?': 'Zijn termijnen gegarandeerd?',
    'Le catalogue de location est-il déjà disponible ?': 'Is de verhuurcatalogus al beschikbaar?',
    'Comment fonctionnera la disponibilité des machines ?': 'Hoe werkt de beschikbaarheid van machines?',
    'Pourrai-je réserver directement en ligne ?': 'Kan ik rechtstreeks online reserveren?',
    'Le stock affiché sera-t-il mis à jour automatiquement ?': 'Wordt de getoonde voorraad automatisch bijgewerkt?',
    'Pourrai-je connaître la prochaine disponibilité d’une machine ?': 'Kan ik de volgende beschikbaarheid van een machine zien?',
    'Y aura-t-il une caution pour le matériel ?': 'Is er een waarborg voor het materiaal?',
    'Comment réserver une prestation d’espaces verts ?': 'Hoe reserveer ik onderhoud van groene ruimtes?',
    'Faut-il créer un compte Ring Twice ?': 'Moet ik een Ring Twice-account aanmaken?',
    'Un devis est-il possible avant intervention ?': 'Is een offerte mogelijk vóór de interventie?',
    'Quelle est la zone d’intervention ?': 'Wat is de interventiezone?',
    'Quels travaux d’espaces verts sont possibles ?': 'Welke groene werken zijn mogelijk?',
    'Dois-je passer par Ring Twice pour un simple renseignement ?': 'Moet ik via Ring Twice gaan voor een eenvoudige vraag?',
    'Est-ce possible de faire une visite avant le travail ?': 'Is een bezoek vóór het werk mogelijk?',
    "Une solution professionnelle pour vos rénovations, vos besoins en matériel et l’entretien de vos espaces verts.": "Een professionele oplossing voor uw renovaties, materiaalbehoeften en onderhoud van groene ruimtes.",
    "Bâtiment et": "Bouw en", "rénovation": "renovatie",
    "Travaux intérieurs, rénovations, aménagements et interventions pour particuliers et professionnels.": "Binnenwerken, renovaties, inrichtingen en interventies voor particulieren en professionals.",
    "En savoir plus": "Meer weten",
    "Location de": "Verhuur van", "matériel": "materiaal",
    "Catalogue d’outils et machines avec disponibilité, planning et gestion des réservations.": "Catalogus van gereedschap en machines met beschikbaarheid, planning en reserveringsbeheer.",
    "Entretien des": "Onderhoud van", "espaces verts": "groene ruimtes",
    "Tonte, taille de haies, nettoyage, débroussaillage et remise en état de vos extérieurs.": "Maaien, hagen snoeien, reinigen, bosmaaien en opfrissen van uw buitenruimtes.",
    "© 2026 IronMarkGear — Site en construction": "© 2026 IronMarkGear — Site in opbouw",
    "Panier": "Winkelmand", "Accueil": "Home", "Réalisations": "Realisaties", "Demande de devis": "Offerte aanvragen",
    "Livraison gratuite sur Bruxelles à partir d’une semaine de location.": "Gratis levering in Brussel vanaf één week huur.",
    "Aucune période sélectionnée.": "Geen periode geselecteerd.",
    "Choisir les dates": "Datums kiezen", "Effacer": "Wissen", "Valider les dates": "Datums bevestigen", "Ajouter une autre date": "Nog een datum toevoegen",

    "Les demandes passent par mon profil Ring Twice afin de centraliser les rendez-vous, les échanges et le règlement.": "Aanvragen verlopen via mijn Ring Twice-profiel om afspraken, berichten en betaling te centraliseren.",
    "Un service d’entretien extérieur propre, clair et encadré.": "Een nette, duidelijke en goed opgevolgde buitendienst.",
    "Note moyenne": "Gemiddelde score",
    "Moyenne pour 154 évaluations sur Ring Twice": "Gemiddelde voor 154 beoordelingen op Ring Twice",
    "Ambassadeur Ring Twice": "Ring Twice-ambassadeur",
    "Prendre rendez-vous": "Afspraak maken",
    "Entretien régulier ou ponctuel": "Regelmatig of eenmalig onderhoud",
    "Entretien régulier ou ponctuel, remise en état et nettoyage général de vos extérieurs.": "Regelmatig of eenmalig onderhoud, opfrissing en algemene reiniging van uw buitenruimte.",
    "Voir les avis Ring Twice": "Ring Twice-beoordelingen bekijken",
    "Avis clients": "Klantbeoordelingen",
    "Zone d’intervention": "Werkgebied",
    "Principalement Bruxelles et alentours": "Voornamelijk Brussel en omgeving",
    "J’interviens principalement sur Bruxelles et ses environs pour l’entretien des espaces verts.": "Ik werk voornamelijk in Brussel en omgeving voor onderhoud van groene ruimtes.",
    "Toute la Belgique selon étude": "Heel België na evaluatie",
    "Une intervention ailleurs en Belgique peut être étudiée selon la nature de la demande, le volume du chantier et l’organisation nécessaire.": "Een interventie elders in België kan bekeken worden volgens de aanvraag, de omvang van het werk en de nodige organisatie.",
    "Comment ça fonctionne ?": "Hoe werkt het?",
    "Réservation via Ring Twice": "Reservering via Ring Twice",
    "La prise de rendez-vous se fait via mon profil Ring Twice afin de centraliser les demandes, les échanges et le règlement.": "Afspraken verlopen via mijn Ring Twice-profiel om aanvragen, communicatie en betaling te centraliseren.",
    "Oui, selon la demande. Je peux échanger avec vous ou venir évaluer le travail avant prestation si nécessaire.": "Ja, afhankelijk van de aanvraag. Indien nodig kan ik met u overleggen of het werk vooraf komen beoordelen.",
    "Paiement final via Ring Twice": "Eindbetaling via Ring Twice",
    "La prestation devra être réglée via Ring Twice, qui sert de plateforme externe sécurisée.": "De prestatie moet via Ring Twice betaald worden, als veilige externe platform.",
    "Galerie réalisations": "Realisatiegalerij",
    "Rendez-vous sur mon profil Ring Twice pour découvrir davantage de réalisations.": "Ga naar mijn Ring Twice-profiel om meer realisaties te bekijken.",
    "Réserver un entretien espaces verts": "Onderhoud van groene ruimtes reserveren",
    "Pour réserver une prestation, cliquez sur le bouton et faites votre demande via mon profil Ring Twice.": "Klik op de knop om een dienst te reserveren en doe uw aanvraag via mijn Ring Twice-profiel.",
    "Un compte Ring Twice sera nécessaire pour accéder au service et finaliser la demande.": "Een Ring Twice-account is nodig om de dienst te gebruiken en de aanvraag af te ronden.",
    "Je peux bien sûr venir faire un devis en amont si nécessaire, mais la prestation devra être réglée via Ring Twice.": "Indien nodig kan ik vooraf een offerte maken, maar de prestatie moet via Ring Twice betaald worden.",
    "Besoin d’aide ou d’une information avant de passer par Ring Twice ? Vous pouvez me contacter directement.": "Hulp of informatie nodig vóór u via Ring Twice gaat? U kunt mij rechtstreeks contacteren.",
    "Prendre rendez-vous sur Ring Twice": "Afspraak maken via Ring Twice",
    "Me contacter directement": "Mij rechtstreeks contacteren",
    "Retrouvez l’ensemble de mes avis directement sur mon profil Ring Twice.": "Bekijk al mijn beoordelingen rechtstreeks op mijn Ring Twice-profiel.",
    "Voir tous les avis Ring Twice": "Alle Ring Twice-beoordelingen bekijken",
    "© 2026 IronMarkGear — Entretien des espaces verts": "© 2026 IronMarkGear — Onderhoud van groene ruimtes",
    "Cliquez pour agrandir": "Klik om te vergroten", "Cliquer pour agrandir": "Klik om te vergroten"
  },
  en: {

    "Services proposés": "Services offered",
    "Tonte & entretien": "Mowing & maintenance",
    "Taille & haies": "Trimming & hedges",
    "Gros travaux de jardinage": "Major gardening work",
    "Taille de haies, végétation mitoyenne, bambous, lierre et débroussaillage selon le besoin.": "Hedge trimming, shared vegetation, bamboo, ivy and brush cutting as needed.",
    "Travaux plus conséquents : utilisation de mini-pelle, préparation de terrain, pose de gazon en rouleau et aménagement extérieur.": "Larger work: mini-excavator use, ground preparation, laying turf rolls and exterior landscaping.",
    "Quelques réalisations": "Selected projects",
    "Comment prendre rendez-vous ?": "How do I book an appointment?",
    "Comment se passe le paiement ?": "How does payment work?",
    "Oui, si nécessaire je peux venir évaluer le travail à réaliser avant la prestation.": "Yes, if needed I can assess the work before the service.",
    "Me contacter pour plus d’informations": "Contact me for more information",
    "Envie de voir plus de photos ?": "Want to see more photos?",
    "Voir mon profil": "View my profile",
    "Voir toutes mes évaluations clients": "View all my customer reviews",
    "Voir mes évaluations": "View my reviews",
    "SuperTalent": "SuperTalent",
    "34 clients réguliers": "34 regular customers",
    "154 évaluations clients": "154 customer reviews",
    'Espace vert': 'Green spaces',
    'Indiquez le type de service souhaité, la commune, les dimensions approximatives, les délais souhaités et ajoutez des photos si possible. Plus la demande est complète, plus la réponse pourra être précise.': 'Specify the desired service, location, approximate dimensions, desired timing and add photos if possible. The more complete the request, the more precise the response can be.',
    'Oui. L’objectif est de permettre une demande de réservation en ligne, avec validation finale. Le client pourra aussi me contacter directement si nécessaire. Une gestion interne permettra d’encoder les locations faites hors site afin que le stock reste à jour.': 'Yes. The goal is to allow online booking requests with final validation. The client can also contact me directly if needed. Internal management will allow off-site rentals to be entered so stock remains up to date.',
    'Vous pouvez me contacter via le site, par message/SMS ou directement via Ring Twice. Dans tous les cas, pour les prestations d’espaces verts, le paiement final passera par Ring Twice afin de centraliser et sécuriser la prestation.': 'You can contact me via the website, by message/SMS or directly through Ring Twice. For green-space services, final payment will go through Ring Twice to centralize and secure the service.',
    'J’interviens principalement sur Bruxelles et les alentours. Selon la nature de la demande, le volume du chantier et l’organisation nécessaire, une intervention peut être étudiée ailleurs en Belgique.': 'I mainly work in Brussels and surrounding areas. Depending on the request, job size and required organization, work elsewhere in Belgium can be considered.',
    'Les demandes peuvent concerner la tonte, la taille de haies, le débroussaillage, le nettoyage extérieur, la remise en état de jardin, la préparation de terrain ou encore la pose de gazon en rouleau. Cette liste n’est pas exhaustive : d’autres travaux extérieurs peuvent être étudiés selon la demande.': 'Requests may include mowing, hedge trimming, brush cutting, outdoor cleaning, garden restoration, ground preparation or laying turf rolls. This list is not exhaustive: other outdoor work can be considered depending on the request.',
    'Non. Vous pouvez d’abord me contacter via le site, WhatsApp ou SMS pour obtenir une information. Pour la prestation finale d’espaces verts, le paiement passera par Ring Twice.': 'No. You can first contact me through the website, WhatsApp or SMS for information. For the final green-space service, payment will go through Ring Twice.',
    'Oui, si la demande le nécessite, une visite ou une estimation préalable peut être organisée afin d’évaluer correctement le travail à réaliser.': 'Yes, if the request requires it, a visit or preliminary estimate can be arranged to properly assess the work to be done.',
    'Envoyez un message avec les informations essentielles, de préférence via WhatsApp.': 'Send a message with the key information, preferably via WhatsApp.',
    "Une solution professionnelle pour vos rénovations, vos besoins en matériel et l’entretien de vos espaces verts.": "A professional solution for your renovations, equipment needs and green space maintenance.",
    "Bâtiment et": "Building and", "rénovation": "renovation",
    "Travaux intérieurs, rénovations, aménagements et interventions pour particuliers et professionnels.": "Interior works, renovations, fit-outs and interventions for private and professional clients.",
    "En savoir plus": "Learn more",
    "Location de": "Equipment", "matériel": "rental",
    "Catalogue d’outils et machines avec disponibilité, planning et gestion des réservations.": "Tools and machines catalogue with availability, planning and booking management.",
    "Entretien des": "Green space", "espaces verts": "maintenance",
    "Tonte, taille de haies, nettoyage, débroussaillage et remise en état de vos extérieurs.": "Mowing, hedge trimming, cleaning, brush cutting and restoring your outdoor spaces.",
    "© 2026 IronMarkGear — Site en construction": "© 2026 IronMarkGear — Site under construction",
    "Panier": "Cart", "Accueil": "Home", "Réalisations": "Projects", "Demande de devis": "Request a quote",
    "Livraison gratuite sur Bruxelles à partir d’une semaine de location.": "Free delivery in Brussels from one week rental.",
    "Aucune période sélectionnée.": "No period selected.",
    "Choisir les dates": "Choose dates", "Effacer": "Clear", "Valider les dates": "Confirm dates", "Ajouter une autre date": "Add another date",

    "Les demandes passent par mon profil Ring Twice afin de centraliser les rendez-vous, les échanges et le règlement.": "Requests go through my Ring Twice profile to centralize appointments, messages and payment.",
    "Un service d’entretien extérieur propre, clair et encadré.": "A clean, clear and structured outdoor maintenance service.",
    "Note moyenne": "Average rating",
    "Moyenne pour 154 évaluations sur Ring Twice": "Average across 154 Ring Twice reviews",
    "Ambassadeur Ring Twice": "Ring Twice Ambassador",
    "Prendre rendez-vous": "Book an appointment",
    "Entretien régulier ou ponctuel": "Regular or one-off maintenance",
    "Entretien régulier ou ponctuel, remise en état et nettoyage général de vos extérieurs.": "Regular or one-off maintenance, restoration and general cleaning of your outdoor areas.",
    "Voir les avis Ring Twice": "View Ring Twice reviews",
    "Avis clients": "Customer reviews",
    "Zone d’intervention": "Service area",
    "Principalement Bruxelles et alentours": "Mainly Brussels and surrounding areas",
    "J’interviens principalement sur Bruxelles et ses environs pour l’entretien des espaces verts.": "I mainly work in Brussels and surrounding areas for green-space maintenance.",
    "Toute la Belgique selon étude": "All Belgium after review",
    "Une intervention ailleurs en Belgique peut être étudiée selon la nature de la demande, le volume du chantier et l’organisation nécessaire.": "Work elsewhere in Belgium can be considered depending on the request, job size and required organization.",
    "Comment ça fonctionne ?": "How does it work?",
    "Réservation via Ring Twice": "Booking via Ring Twice",
    "La prise de rendez-vous se fait via mon profil Ring Twice afin de centraliser les demandes, les échanges et le règlement.": "Appointments are booked through my Ring Twice profile to centralize requests, communication and payment.",
    "Oui, selon la demande. Je peux échanger avec vous ou venir évaluer le travail avant prestation si nécessaire.": "Yes, depending on the request. If needed, I can discuss with you or assess the work before the service.",
    "Paiement final via Ring Twice": "Final payment via Ring Twice",
    "La prestation devra être réglée via Ring Twice, qui sert de plateforme externe sécurisée.": "The service must be paid through Ring Twice, which acts as a secure external platform.",
    "Galerie réalisations": "Project gallery",
    "Rendez-vous sur mon profil Ring Twice pour découvrir davantage de réalisations.": "Visit my Ring Twice profile to see more projects.",
    "Réserver un entretien espaces verts": "Book green-space maintenance",
    "Pour réserver une prestation, cliquez sur le bouton et faites votre demande via mon profil Ring Twice.": "To book a service, click the button and send your request through my Ring Twice profile.",
    "Un compte Ring Twice sera nécessaire pour accéder au service et finaliser la demande.": "A Ring Twice account is required to use the service and finalize the request.",
    "Je peux bien sûr venir faire un devis en amont si nécessaire, mais la prestation devra être réglée via Ring Twice.": "I can of course provide an estimate beforehand if needed, but the service must be paid through Ring Twice.",
    "Besoin d’aide ou d’une information avant de passer par Ring Twice ? Vous pouvez me contacter directement.": "Need help or information before using Ring Twice? You can contact me directly.",
    "Prendre rendez-vous sur Ring Twice": "Book on Ring Twice",
    "Me contacter directement": "Contact me directly",
    "Retrouvez l’ensemble de mes avis directement sur mon profil Ring Twice.": "Find all my reviews directly on my Ring Twice profile.",
    "Voir tous les avis Ring Twice": "View all Ring Twice reviews",
    "© 2026 IronMarkGear — Entretien des espaces verts": "© 2026 IronMarkGear — Green-space maintenance",
    "Cliquez pour agrandir": "Click to enlarge", "Cliquer pour agrandir": "Click to enlarge"
  }
};

function translateLegacyText(root: HTMLElement, lang: Lang) {
  const replacements = { ...(legacyText[lang] || {}), ...(extraLegacyText[lang] || {}), ...(additionalLegacyText[lang] || {}) };
  if (lang === "fr") return;
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
  const normalizedReplacements = new Map(Object.entries(replacements).map(([key, value]) => [normalize(key), value]));
  const fallbackPairs: [string, string][] = lang === "nl" ? [
    ["Tonte, taille de haies, débroussaillage, ramassage de feuilles, nettoyage de gouttières et remise en état d’extérieurs.", "Maaien, hagen snoeien, bosmaaien, bladeren opruimen, dakgoten reinigen en buitenruimtes herstellen."],
    ["Les demandes passent par mon profil Ring Twice afin de centraliser les rendez-vous, les échanges et le règlement.", "Aanvragen verlopen via mijn Ring Twice-profiel om afspraken, communicatie en betaling te centraliseren."],
    ["Services proposés", "Aangeboden diensten"], ["Tonte & entretien", "Maaien & onderhoud"], ["Taille & haies", "Hagen snoeien"], ["Gros travaux de jardinage", "Grote tuinwerken"],
    ["Taille de haies, végétation mitoyenne, bambous, lierre et débroussaillage selon le besoin.", "Hagen snoeien, gemeenschappelijke begroeiing, bamboe, klimop en bosmaaien volgens behoefte."],
    ["Travaux plus conséquents : utilisation de mini-pelle, préparation de terrain, pose de gazon en rouleau et aménagement extérieur.", "Grotere werken: minigraver, terreinvoorbereiding, graszoden leggen en buitenaanleg."],
    ["Note moyenne", "Gemiddelde score"], ["Moyenne pour 154 évaluations sur Ring Twice", "Gemiddelde voor 154 beoordelingen op Ring Twice"],
    ["Ambassadeur Ring Twice", "Ring Twice-ambassadeur"], ["clients réguliers", "vaste klanten"], ["évaluations clients", "klantbeoordelingen"],
    ["Avis clients", "Klantbeoordelingen"], ["Zone d’intervention", "Werkgebied"], ["Principalement Bruxelles et alentours", "Vooral Brussel en omgeving"],
    ["J’interviens principalement sur Bruxelles et ses environs pour l’entretien des espaces verts.", "Ik werk vooral in Brussel en omgeving voor het onderhoud van groene ruimtes."],
    ["Toute la Belgique selon étude", "Heel België na beoordeling"], ["Une intervention ailleurs en Belgique peut être étudiée selon la nature de la demande, le volume du chantier et l’organisation nécessaire.", "Een interventie elders in België kan worden bekeken afhankelijk van de aanvraag, de omvang en de organisatie."],
    ["Comment ça fonctionne ?", "Hoe werkt het?"], ["Réservation via Ring Twice", "Boeking via Ring Twice"], ["Paiement final via Ring Twice", "Eindbetaling via Ring Twice"],
    ["Galerie réalisations", "Realisatiegalerij"], ["Prendre rendez-vous sur Ring Twice", "Afspraak maken via Ring Twice"], ["Me contacter directement", "Rechtstreeks contact opnemen"],
    ["Voir tous les avis Ring Twice", "Alle Ring Twice-beoordelingen bekijken"], ["Régulier ou ponctuel", "Regelmatig of eenmalig"], ["Devis possible", "Offerte mogelijk"],
  ] : [
    ["Tonte, taille de haies, débroussaillage, ramassage de feuilles, nettoyage de gouttières et remise en état d’extérieurs.", "Mowing, hedge trimming, brush cutting, leaf collection, gutter cleaning and outdoor restoration."],
    ["Les demandes passent par mon profil Ring Twice afin de centraliser les rendez-vous, les échanges et le règlement.", "Requests go through my Ring Twice profile to centralize appointments, communication and payment."],
    ["Services proposés", "Services offered"], ["Tonte & entretien", "Mowing & maintenance"], ["Taille & haies", "Hedge trimming"], ["Gros travaux de jardinage", "Major gardening work"],
    ["Taille de haies, végétation mitoyenne, bambous, lierre et débroussaillage selon le besoin.", "Hedge trimming, shared vegetation, bamboo, ivy and brush cutting as needed."],
    ["Travaux plus conséquents : utilisation de mini-pelle, préparation de terrain, pose de gazon en rouleau et aménagement extérieur.", "Larger jobs: mini-excavator work, ground preparation, turf laying and outdoor landscaping."],
    ["Note moyenne", "Average rating"], ["Moyenne pour 154 évaluations sur Ring Twice", "Average across 154 Ring Twice reviews"],
    ["Ambassadeur Ring Twice", "Ring Twice Ambassador"], ["clients réguliers", "regular customers"], ["évaluations clients", "customer reviews"],
    ["Avis clients", "Customer reviews"], ["Zone d’intervention", "Service area"], ["Principalement Bruxelles et alentours", "Mainly Brussels and surroundings"],
    ["J’interviens principalement sur Bruxelles et ses environs pour l’entretien des espaces verts.", "I mainly work in Brussels and nearby areas for green-space maintenance."],
    ["Toute la Belgique selon étude", "All Belgium after review"], ["Une intervention ailleurs en Belgique peut être étudiée selon la nature de la demande, le volume du chantier et l’organisation nécessaire.", "Work elsewhere in Belgium can be reviewed depending on the request, job size and organization required."],
    ["Comment ça fonctionne ?", "How does it work?"], ["Réservation via Ring Twice", "Booking via Ring Twice"], ["Paiement final via Ring Twice", "Final payment via Ring Twice"],
    ["Galerie réalisations", "Project gallery"], ["Prendre rendez-vous sur Ring Twice", "Book on Ring Twice"], ["Me contacter directement", "Contact me directly"],
    ["Voir tous les avis Ring Twice", "View all Ring Twice reviews"], ["Régulier ou ponctuel", "Regular or one-off"], ["Devis possible", "Quote possible"],
  ];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    const original = node.nodeValue || "";
    const trimmed = normalize(original);
    const translated = normalizedReplacements.get(trimmed);
    if (trimmed && translated) {
      node.nodeValue = original.replace(original.trim(), translated);
      return;
    }
    let updated = original;
    fallbackPairs.forEach(([from, to]) => { updated = updated.split(from).join(to); });
    if (updated !== original) node.nodeValue = updated;
  });
}


function normalizeLegacyHeader(root: HTMLElement, lang: Lang) {
  const header = root.querySelector<HTMLElement>('header');
  const nav = header?.querySelector<HTMLElement>('nav');
  if (!header || !nav) return;

  header.classList.add('site-header', 'legacy-unified-header');
  header.querySelector<HTMLElement>('.logo')?.classList.add('brand');

  const normalizeHref = (href: string | null) => {
    if (!href) return '';
    return href
      .replace(/^\.\//, '')
      .replace('index.html', '/')
      .replace('realisations.html', '/realisations')
      .replace('faq.html', '/faq')
      .replace('contact.html', '/devis')
      .replace('devis.html', '/devis')
      .replace('panier.html', '/panier');
  };

  Array.from(nav.querySelectorAll<HTMLAnchorElement>('a')).forEach((link) => {
    const href = normalizeHref(link.getAttribute('href'));
    if (href) link.href = href;
    link.classList.remove('btn-devis');
    if (href === '/devis') {
      link.textContent = t(lang, 'navQuoteContact');
      link.classList.add('btn-devis', 'nav-devis-link');
    }
    if (href === '/panier') {
      link.textContent = t(lang, 'navCart');
      link.classList.add('cart-nav-link');
    }
  });

  // Fusion Contact + Devis: si deux liens pointent vers /devis, on garde uniquement le CTA devis/contact.
  const devisLinks = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href$="/devis"], a[href="/devis"]'));
  devisLinks.forEach((link, index) => {
    if (index < devisLinks.length - 1) link.remove();
  });

  const desired = ['/', '/realisations', '/faq', '/devis', '/panier'];
  const labels: Record<string, string> = {
    '/': t(lang, 'navHome'),
    '/realisations': t(lang, 'navRealisations'),
    '/faq': t(lang, 'navFaq'),
    '/devis': t(lang, 'navQuoteContact'),
    '/panier': t(lang, 'navCart')
  };
  desired.forEach((href) => {
    let link = nav.querySelector<HTMLAnchorElement>(`a[href$="${href === '/' ? '/' : href}"]`);
    if (!link) {
      link = document.createElement('a');
      link.href = href;
      nav.appendChild(link);
    }
    link.textContent = labels[href];
    if (href === '/devis') link.classList.add('btn-devis', 'nav-devis-link');
    if (href === '/panier') link.classList.add('cart-nav-link');
    nav.appendChild(link);
  });
}

function injectLanguageSwitcher(root: HTMLElement, lang: Lang, setLang: (lang: Lang) => void) {
  root.querySelectorAll(".legacy-language-switcher").forEach((node) => node.remove());
  const header = root.querySelector("header");
  if (!header) return;
  const switcher = document.createElement("div");
  switcher.className = "legacy-language-switcher language-switcher";
  (["fr", "nl", "en"] as Lang[]).forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.toUpperCase();
    button.className = item === lang ? "is-active" : "";
    button.setAttribute("aria-pressed", String(item === lang));
    button.addEventListener("click", () => setLang(item));
    switcher.appendChild(button);
  });
  header.appendChild(switcher);
}

export function LegacyHtmlPage({ html, bodyClass = "" }: { html: string; bodyClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const added = bodyClass.split(/\s+/).filter(Boolean);
    document.body.classList.add(...added);
    return () => { document.body.classList.remove(...added); };
  }, [bodyClass]);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    // Conserve les questions FAQ ouvertes quand la langue change.
    const openDetailIndexes = Array.from(host.querySelectorAll("details"))
      .map((detail, index) => detail.open ? index : -1)
      .filter((index) => index >= 0);

    host.innerHTML = html;

    if (openDetailIndexes.length > 0) {
      const details = Array.from(host.querySelectorAll("details"));
      details.forEach((detail, index) => {
        detail.open = openDetailIndexes.includes(index);
      });
    }

    translateLegacyText(host, lang);
    normalizeLegacyHeader(host, lang);
    injectLanguageSwitcher(host, lang, setLang);

    const scripts = Array.from(host.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }
      let scriptText = oldScript.textContent || "";
      if (!oldScript.src) {
        scriptText = scriptText
          .replace(/const photos =/g, "var photos =")
          .replace(/const reviews =/g, "var reviews =")
          .replace(/const photosPerPage =/g, "var photosPerPage =")
          .replace(/const reviewsPerPage =/g, "var reviewsPerPage =")
          .replace(/let galleryPage =/g, "var galleryPage =")
          .replace(/let reviewsPage =/g, "var reviewsPage =")
          .replace(/let lightboxIndex =/g, "var lightboxIndex =");
      }
      newScript.text = oldScript.src ? scriptText : scriptText;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    const logos = Array.from(host.querySelectorAll<HTMLElement>("header .logo"));
    logos.forEach((logo) => {
      logo.setAttribute("role", "link");
      logo.setAttribute("tabindex", "0");
      logo.setAttribute("aria-label", t(lang, "brandHome"));
      logo.onclick = () => { window.location.href = "/"; };
      logo.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = "/";
        }
      };
    });

    // Uniformise les anciens headers HTML : Contact + Devis deviennent un seul onglet.
    host.querySelectorAll<HTMLAnchorElement>('nav a[href="/contact"]').forEach((link) => link.remove());
    host.querySelectorAll<HTMLAnchorElement>('nav a[href="/devis"], nav a[href="/contact"]').forEach((link) => {
      link.href = "/devis";
      link.textContent = t(lang, "navQuoteContact");
      link.classList.add("btn-devis");
    });

    const cartLinks = Array.from(host.querySelectorAll<HTMLAnchorElement>('nav a[href="/panier"]'));
    const refreshCartBadges = () => {
      const count = readCart().reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      cartLinks.forEach((link) => {
        link.classList.add("cart-nav-link");
        link.querySelectorAll(".cart-icon").forEach((icon) => icon.remove());
        link.textContent = t(lang, "navCart");
        if (count > 0) {
          const badge = document.createElement("span");
          badge.className = "cart-count-badge";
          badge.textContent = String(count);
          link.appendChild(badge);
        }
      });
    };
    refreshCartBadges();
    window.addEventListener("img-cart-updated", refreshCartBadges);
    window.addEventListener("storage", refreshCartBadges);
    return () => {
      window.removeEventListener("img-cart-updated", refreshCartBadges);
      window.removeEventListener("storage", refreshCartBadges);
    };
  }, [html, lang, setLang]);

  return <div ref={ref} suppressHydrationWarning />;
}
