import { products as baseProducts, type Product } from "./products";

export type Lang = "fr" | "nl" | "en";
export const languages: Lang[] = ["fr", "nl", "en"];
export const defaultLang: Lang = "fr";

export function normalizeLang(value?: string | null): Lang {
  return value === "nl" || value === "en" || value === "fr" ? value : defaultLang;
}

export const ui: Record<Lang, Record<string, string>> = {
  fr: {
    navHome: "Accueil", navRealisations: "Réalisations", navFaq: "FAQ", navContact: "Contact", navQuote: "Demande de devis", navQuoteContact: "Demande de devis / Contact", navCart: "Panier",
    brandHome: "Retour à l’accueil IronMarkGear",
    footerText: "Travaux, location de matériel et entretien d'espaces verts.",
    locationHeroAlt: "Location de matériel professionnel IronMarkGear", heroTitle: "Location de matériel professionnel", heroSubtitle: "Machines prêtes pour chantier, jardin et nettoyage. Service clair, matériel fiable, demande de devis rapide.", rentNow: "Louer maintenant", generator: "Générateur", dryfast: "Dryfast DF800",
    locationHeroBadge: "LOCATION DE MATÉRIEL PROFESSIONNEL", locationHeroTitle: "Performance et fiabilité", locationHeroDescription: "Du matériel professionnel, entretenu avec soin, pour garantir la réussite de tous vos chantiers, où que vous soyez.", locationHeroHighlights: "Points forts location", locationHeroFeature1Title: "Matériel professionnel", locationHeroFeature1Text: "Des équipements puissants et sélectionnés pour leur fiabilité et leur performance.", locationHeroFeature2Title: "Entretien rigoureux", locationHeroFeature2Text: "Chaque machine est contrôlée et entretenue avant chaque location.", locationHeroFeature3Title: "Conseils d’experts", locationHeroFeature3Text: "Notre équipe vous accompagne pour choisir le matériel adapté à vos besoins.", locationHeroFeature4Title: "Disponibilité rapide", locationHeroFeature4Text: "Retrait sur place ou livraison sur chantier, selon vos besoins.", locationHeroBottomNote: "Paiement sécurisé et assurance incluse",
    catalogKicker: "Catalogue location", catalogTitle: "Matériel disponible à la location", catalogText: "Filtrez rapidement les machines, consultez les détails, puis ajoutez-les au panier pour devis ou contactez-nous directement.",
    allEquipment: "Tous les matériels", smallEquipment: "Petit matériel", heavyMachines: "Machines lourdes", cleaning: "Nettoyage", gardening: "Jardinage", batteries: "Batteries",
    searchMachine: "Rechercher une machine…", allStatuses: "Tous les statuts", available: "Disponible", outOfStockShort: "Rupture", emptyFilter: "Aucune machine ne correspond aux filtres sélectionnés.",
    quoteOnlyAdded: "Machine ajoutée au panier pour devis", viewDetails: "Voir détails", addQuoteCart: "Ajouter au panier pour devis",
    outMessage: "Victime de son succès, bientôt de retour en stock", priceToDefine: "Prix à définir", cautionToDefine: "Caution à définir", priceExVat: "Prix HTVA", priceDurationDefine: "prix à définir selon durée", cautionDurationDefine: "Caution à définir selon durée et conditions",
    backCatalog: "← Retour au catalogue", zoomImage: "Cliquer pour agrandir", closeGallery: "Fermer la galerie", previousPhoto: "Photo précédente", nextPhoto: "Photo suivante",
    chooseDates: "Choisir les dates", unavailableDatesText: "Ce produit est actuellement indisponible. Les dates avant son retour sont bloquées.", calendarHelp: "Choisissez la date de début puis la date de fin directement dans le calendrier.",
    startEndWarning: "Sélectionnez une date de début et une date de fin", periodValidated: "Période validée", clear: "Effacer", validateDates: "Valider les dates", addAnotherDate: "Ajouter une autre date", addAnotherDateToast: "Une nouvelle période pourra être ajoutée après validation", noPeriod: "Aucune période sélectionnée.", selectedPeriod: "Période sélectionnée",
    stockAlertTitle: "Alerte retour en stock", stockAlertText: "Entrez votre adresse email : vous serez averti 1 jour avant le retour du produit, ainsi que le jour J.", emailPlaceholder: "Votre adresse email", notifyMe: "Me prévenir", alertSaved: "Alerte retour enregistrée",
    features: "Caractéristiques", usage: "Méthode d’utilisation", addCart: "Ajouter au panier", reservationSoon: "Sélectionnez d’abord vos dates dans le calendrier, puis validez-les avant d’ajouter la machine au panier.", quoteCartAdded: "Machine ajoutée au panier pour devis", cartAdded: "Machine ajoutée au panier", cartAddedWithoutDates: "Machine ajoutée au panier sans date. La durée sera précisée dans la demande de devis.", datePromptTitle: "Souhaitez-vous ajouter des dates de location ?", datePromptText: "Vous pouvez sélectionner une période maintenant pour obtenir un prix estimé, ou ajouter cette machine au panier sans date et définir la durée plus tard.", addWithoutDates: "Ajouter quand même sans date", reserveWhatsapp: "Réserver par WhatsApp", whatsappText: "Bonjour, je souhaite réserver ou demander des informations pour",
    quoteKicker: "Demande de devis", quoteTitle: "Parlez-nous de votre besoin", quoteIntro: "Remplissez le formulaire. Pour la location, la liste des machines est synchronisée automatiquement avec le catalogue et l’admin.",
    nameRef: "Nom ou personne de référence", yourName: "Votre nom", phone: "Téléphone", yourPhone: "Votre numéro", email: "E-mail", addressSite: "Adresse ou commune du chantier", addressPlaceholder: "Commune, rue ou zone d’intervention", serviceType: "Type de service", serviceRental: "Location de matériel", serviceBuilding: "Bâtiment / rénovation", serviceGreen: "Espaces verts", serviceOther: "Autre demande", machinesWanted: "Machines souhaitées", machinesAuto: "La liste vient automatiquement des machines visibles dans l’admin.", cartImportedTitle: "Panier importé avec dates et durées", chooseMachine: "Choisir une machine", remove: "Supprimer", removeAll: "Tout supprimer", requestDescription: "Description de la demande", requestPlaceholder: "Décrivez votre besoin, dimensions, délais, contraintes…", sendRequest: "Envoyer la demande", quoteNote: "Ce formulaire ouvre votre application e-mail pour l’instant. Un formulaire automatisé sera ajouté avec l’hébergement et la base de données.", noneSelected: "aucune sélection", contactKicker: "Contact direct", contactTitle: "Contact & informations", contactIntro: "Pour une réponse rapide, privilégiez WhatsApp ou SMS. Aucun appel direct prioritaire.", vatNumber: "Numéro de TVA", contactNotice: "Merci d’envoyer un message en priorité, idéalement via WhatsApp. Indiquez directement le type de demande, la commune, les photos si possible, les dimensions approximatives, les délais souhaités et toute information utile.", whatsappButton: "Envoyer un message WhatsApp", emailButton: "Envoyer un e-mail",

    cartTitle: "Votre panier location", cartIntro: "Retrouvez ici les machines ajoutées pour une demande de devis.", cartEmpty: "Votre panier est vide", cartEmptyHelp: "Ajoutez une machine depuis le catalogue location pour préparer votre demande.", cartItemRemoved: "Article retiré du panier", cartCleared: "Panier vidé", quoteOnlyMachine: "Machine à soumettre en devis", rentalMachine: "Machine en location", dates: "Dates", days: "jour(s)", dateToDefine: "Date à définir", estimatedPrice: "Prix estimé", cartSummary: "Résumé", cartTotal: "Total estimé", cartDeliveryNote: "Les frais de livraison sont HTVA et calculés en aller-retour selon le type de matériel.", clearCart: "Vider tout le panier",
    heroImageTranslationNote: "Le visuel location reste une image. Les textes visibles du site sont traduits par-dessus et dans l’interface ; une variante d’image par langue pourra être branchée plus tard si vous souhaitez traduire le texte intégré dans l’image.",
    dryfastDelivery: "Livraison gratuite sur Bruxelles à partir d’une semaine de location.",
  },
  nl: {
    navHome: "Home", navRealisations: "Realisaties", navFaq: "FAQ", navContact: "Contact", navQuote: "Offerte aanvragen", navQuoteContact: "Offerte / Contact", navCart: "Winkelmand",
    brandHome: "Terug naar de startpagina van IronMarkGear",
    footerText: "Werken, verhuur van materiaal en onderhoud van groene ruimtes.",
    locationHeroAlt: "Professionele materiaalverhuur IronMarkGear", heroTitle: "Professionele materiaalverhuur", heroSubtitle: "Machines klaar voor werf, tuin en reiniging. Duidelijke service, betrouwbaar materiaal en snel offerteverzoek.", rentNow: "Nu huren", generator: "Generator", dryfast: "Dryfast DF800",
    locationHeroBadge: "PROFESSIONELE MATERIEELVERHUUR", locationHeroTitle: "Prestaties en betrouwbaarheid", locationHeroDescription: "Professioneel materiaal, zorgvuldig onderhouden, om het succes van uw projecten te garanderen, waar u ook bent.", locationHeroHighlights: "Sterke punten verhuur", locationHeroFeature1Title: "Professioneel materiaal", locationHeroFeature1Text: "Krachtig materiaal geselecteerd op betrouwbaarheid en prestaties.", locationHeroFeature2Title: "Strikt onderhoud", locationHeroFeature2Text: "Elke machine wordt vóór elke verhuur gecontroleerd en onderhouden.", locationHeroFeature3Title: "Deskundig advies", locationHeroFeature3Text: "Ons team helpt u het juiste materiaal voor uw behoeften te kiezen.", locationHeroFeature4Title: "Snelle beschikbaarheid", locationHeroFeature4Text: "Afhaling of levering op de werf, afhankelijk van uw behoeften.", locationHeroBottomNote: "Veilige betaling en verzekering inbegrepen",
    catalogKicker: "Verhuurcatalogus", catalogTitle: "Materiaal beschikbaar voor verhuur", catalogText: "Filter snel de machines, bekijk de details en voeg ze toe aan de offertewagen of neem rechtstreeks contact op.",
    allEquipment: "Alle materialen", smallEquipment: "Klein materiaal", heavyMachines: "Zware machines", cleaning: "Reiniging", gardening: "Tuinonderhoud", batteries: "Batterijen",
    searchMachine: "Een machine zoeken…", allStatuses: "Alle statussen", available: "Beschikbaar", outOfStockShort: "Niet op voorraad", emptyFilter: "Geen machine komt overeen met de geselecteerde filters.",
    quoteOnlyAdded: "Machine toegevoegd aan de offertewagen", viewDetails: "Details bekijken", addQuoteCart: "Toevoegen voor offerte",
    outMessage: "Slachtoffer van zijn succes, binnenkort weer op voorraad", priceToDefine: "Prijs te bepalen", cautionToDefine: "Waarborg te bepalen", priceExVat: "Prijs excl. btw", priceDurationDefine: "prijs volgens duur te bepalen", cautionDurationDefine: "Waarborg volgens duur en voorwaarden te bepalen",
    backCatalog: "← Terug naar catalogus", zoomImage: "Klik om te vergroten", closeGallery: "Galerij sluiten", previousPhoto: "Vorige foto", nextPhoto: "Volgende foto",
    chooseDates: "Datums kiezen", unavailableDatesText: "Dit product is momenteel niet beschikbaar. Datums vóór de terugkeer zijn geblokkeerd.", calendarHelp: "Kies de startdatum en daarna de einddatum rechtstreeks in de kalender.",
    startEndWarning: "Selecteer een start- en einddatum", periodValidated: "Periode bevestigd", clear: "Wissen", validateDates: "Datums bevestigen", addAnotherDate: "Nog een datum toevoegen", addAnotherDateToast: "Na bevestiging kan een nieuwe periode worden toegevoegd", noPeriod: "Geen periode geselecteerd.", selectedPeriod: "Geselecteerde periode",
    stockAlertTitle: "Voorraadmelding", stockAlertText: "Vul uw e-mailadres in: u wordt 1 dag vóór de terugkeer en op de dag zelf verwittigd.", emailPlaceholder: "Uw e-mailadres", notifyMe: "Breng mij op de hoogte", alertSaved: "Voorraadmelding opgeslagen",
    features: "Kenmerken", usage: "Gebruiksmethode", addCart: "Toevoegen aan winkelmand", reservationSoon: "Selecteer eerst uw datums in de kalender en bevestig ze voordat u de machine aan de winkelmand toevoegt.", quoteCartAdded: "Machine toegevoegd aan de offertewagen", cartAdded: "Machine toegevoegd aan winkelmand", cartAddedWithoutDates: "Machine zonder datum toegevoegd. De duur wordt later in de offerteaanvraag bepaald.", datePromptTitle: "Wilt u verhuurdatums toevoegen?", datePromptText: "U kunt nu een periode kiezen voor een geschatte prijs, of deze machine zonder datum toevoegen en de duur later bepalen.", addWithoutDates: "Toch zonder datum toevoegen", reserveWhatsapp: "Reserveren via WhatsApp", whatsappText: "Hallo, ik wil reserveren of informatie vragen over",
    quoteKicker: "Offerte aanvragen", quoteTitle: "Vertel ons wat u nodig hebt", quoteIntro: "Vul het formulier in. Voor verhuur wordt de machinelijst automatisch gesynchroniseerd met de catalogus en admin.",
    nameRef: "Naam of referentiepersoon", yourName: "Uw naam", phone: "Telefoon", yourPhone: "Uw nummer", email: "E-mail", addressSite: "Adres of gemeente van de werf", addressPlaceholder: "Gemeente, straat of werkzone", serviceType: "Type dienst", serviceRental: "Materiaalverhuur", serviceBuilding: "Bouw / renovatie", serviceGreen: "Groene ruimtes", serviceOther: "Andere aanvraag", machinesWanted: "Gewenste machines", machinesAuto: "De lijst komt automatisch van de zichtbare machines in de admin.", cartImportedTitle: "Winkelmand geïmporteerd met data en duur", chooseMachine: "Kies een machine", remove: "Verwijderen", removeAll: "Alles verwijderen", requestDescription: "Beschrijving van de aanvraag", requestPlaceholder: "Beschrijf uw behoefte, afmetingen, timing, beperkingen…", sendRequest: "Aanvraag verzenden", quoteNote: "Dit formulier opent voorlopig uw e-mailprogramma. Een geautomatiseerd formulier wordt toegevoegd met hosting en database.", noneSelected: "geen selectie", contactKicker: "Direct contact", contactTitle: "Contact & informatie", contactIntro: "Voor een snelle reactie: liefst WhatsApp of SMS. Telefoneren is niet prioritair.", vatNumber: "Btw-nummer", contactNotice: "Stuur bij voorkeur een bericht via WhatsApp. Vermeld het type aanvraag, de gemeente, indien mogelijk foto’s, afmetingen, gewenste timing en nuttige informatie.", whatsappButton: "WhatsApp-bericht sturen", emailButton: "E-mail sturen",

    cartTitle: "Uw verhuurmand", cartIntro: "Hier vindt u de machines die aan uw offerteaanvraag zijn toegevoegd.", cartEmpty: "Uw winkelmand is leeg", cartEmptyHelp: "Voeg een machine toe vanuit de verhuurcatalogus om uw aanvraag voor te bereiden.", cartItemRemoved: "Artikel verwijderd uit de winkelmand", cartCleared: "Winkelmand geleegd", quoteOnlyMachine: "Machine op offerte aanvragen", rentalMachine: "Verhuurmachine", dates: "Datums", days: "dag(en)", dateToDefine: "Datum te bepalen", estimatedPrice: "Geschatte prijs", cartSummary: "Samenvatting", cartTotal: "Geschat totaal", cartDeliveryNote: "Leveringskosten zijn excl. btw en worden heen-en-terug berekend volgens het type materiaal.", clearCart: "Winkelmand volledig leegmaken",
    heroImageTranslationNote: "De verhuurvisual blijft een afbeelding. De zichtbare siteteksten worden erboven en in de interface vertaald; later kan per taal een aparte afbeelding worden aangesloten om tekst in de afbeelding te vertalen.",
    dryfastDelivery: "Gratis levering in Brussel vanaf één week huur.",
  },
  en: {
    navHome: "Home", navRealisations: "Projects", navFaq: "FAQ", navContact: "Contact", navQuote: "Request a quote", navQuoteContact: "Quote / Contact", navCart: "Cart",
    brandHome: "Back to IronMarkGear home", footerText: "Works, equipment rental and green space maintenance.",
    locationHeroAlt: "IronMarkGear professional equipment rental", heroTitle: "Professional equipment rental", heroSubtitle: "Machines ready for worksites, garden jobs and cleaning. Clear service, reliable equipment and quick quote requests.", rentNow: "Rent now", generator: "Generator", dryfast: "Dryfast DF800",
    locationHeroBadge: "PROFESSIONAL EQUIPMENT RENTAL", locationHeroTitle: "Performance and reliability", locationHeroDescription: "Professional equipment, carefully maintained, to help ensure the success of your projects wherever you are.", locationHeroHighlights: "Rental highlights", locationHeroFeature1Title: "Professional equipment", locationHeroFeature1Text: "Powerful equipment selected for reliability and performance.", locationHeroFeature2Title: "Strict maintenance", locationHeroFeature2Text: "Every machine is checked and maintained before each rental.", locationHeroFeature3Title: "Expert advice", locationHeroFeature3Text: "Our team helps you choose the right equipment for your needs.", locationHeroFeature4Title: "Fast availability", locationHeroFeature4Text: "Pickup or delivery to site, depending on your needs.", locationHeroBottomNote: "Secure payment and insurance included",
    catalogKicker: "Rental catalogue", catalogTitle: "Equipment available for rental", catalogText: "Quickly filter machines, check details, then add them to the quote cart or contact us directly.",
    allEquipment: "All equipment", smallEquipment: "Small equipment", heavyMachines: "Heavy machines", cleaning: "Cleaning", gardening: "Gardening", batteries: "Batteries",
    searchMachine: "Search for a machine…", allStatuses: "All statuses", available: "Available", outOfStockShort: "Out of stock", emptyFilter: "No machine matches the selected filters.",
    quoteOnlyAdded: "Machine added to quote cart", viewDetails: "View details", addQuoteCart: "Add to quote cart",
    outMessage: "A victim of its own success, back in stock soon", priceToDefine: "Price to be defined", cautionToDefine: "Deposit to be defined", priceExVat: "Price excl. VAT", priceDurationDefine: "price to be defined by duration", cautionDurationDefine: "Deposit to be defined by duration and conditions",
    backCatalog: "← Back to catalogue", zoomImage: "Click to enlarge", closeGallery: "Close gallery", previousPhoto: "Previous photo", nextPhoto: "Next photo",
    chooseDates: "Choose dates", unavailableDatesText: "This product is currently unavailable. Dates before its return are blocked.", calendarHelp: "Choose the start date and then the end date directly in the calendar.",
    startEndWarning: "Select a start date and an end date", periodValidated: "Period confirmed", clear: "Clear", validateDates: "Confirm dates", addAnotherDate: "Add another date", addAnotherDateToast: "A new period can be added after confirmation", noPeriod: "No period selected.", selectedPeriod: "Selected period",
    stockAlertTitle: "Back-in-stock alert", stockAlertText: "Enter your email address: you will be notified 1 day before the product returns and again on the return day.", emailPlaceholder: "Your email address", notifyMe: "Notify me", alertSaved: "Stock alert saved",
    features: "Specifications", usage: "How to use", addCart: "Add to cart", reservationSoon: "Select your dates in the calendar and confirm them before adding the machine to the cart.", quoteCartAdded: "Machine added to quote cart", cartAdded: "Machine added to cart", cartAddedWithoutDates: "Machine added without dates. The duration will be defined in the quote request.", datePromptTitle: "Would you like to add rental dates?", datePromptText: "You can select a rental period now to get an estimated price, or add this machine without dates and define the duration later.", addWithoutDates: "Add without dates anyway", reserveWhatsapp: "Reserve via WhatsApp", whatsappText: "Hello, I would like to book or ask for information about",
    quoteKicker: "Request a quote", quoteTitle: "Tell us what you need", quoteIntro: "Fill in the form. For rentals, the machine list is automatically synchronized with the catalogue and admin.",
    nameRef: "Name or reference person", yourName: "Your name", phone: "Phone", yourPhone: "Your number", email: "Email", addressSite: "Site address or town", addressPlaceholder: "Town, street or work area", serviceType: "Service type", serviceRental: "Equipment rental", serviceBuilding: "Building / renovation", serviceGreen: "Green spaces", serviceOther: "Other request", machinesWanted: "Requested machines", machinesAuto: "The list comes automatically from the machines visible in admin.", cartImportedTitle: "Cart imported with dates and duration", chooseMachine: "Choose a machine", remove: "Remove", removeAll: "Remove all", requestDescription: "Request description", requestPlaceholder: "Describe your need, dimensions, timing, constraints…", sendRequest: "Send request", quoteNote: "For now, this form opens your email application. An automated form will be added with hosting and database.", noneSelected: "none selected", contactKicker: "Direct contact", contactTitle: "Contact & information", contactIntro: "For a quick reply, please use WhatsApp or SMS first. Direct calls are not the priority.", vatNumber: "VAT number", contactNotice: "Please send a message first, ideally via WhatsApp. Include the request type, town, photos if possible, approximate dimensions, desired timing and useful details.", whatsappButton: "Send a WhatsApp message", emailButton: "Send an email",

    cartTitle: "Your rental cart", cartIntro: "Find the machines added for a quote request here.", cartEmpty: "Your cart is empty", cartEmptyHelp: "Add a machine from the rental catalogue to prepare your request.", cartItemRemoved: "Item removed from cart", cartCleared: "Cart cleared", quoteOnlyMachine: "Machine to submit for quote", rentalMachine: "Rental machine", dates: "Dates", days: "day(s)", dateToDefine: "Date to define", estimatedPrice: "Estimated price", cartSummary: "Summary", cartTotal: "Estimated total", cartDeliveryNote: "Delivery fees are excluding VAT and calculated round-trip according to equipment type.", clearCart: "Clear whole cart",
    heroImageTranslationNote: "The rental visual remains an image. Visible site text is translated as overlays and in the interface; a dedicated image per language can be connected later if you want embedded image text translated.",
  }
};

const productTranslations: Record<string, Partial<Record<Lang, Partial<Product>>>> = {
  "dryfast-df800": {
    nl: { title: "Professionele bouwdroger Dryfast DF800", description: "Professionele bouwdroger voor werven, droging na werken, resterend vocht of het drogen van lokalen.", features: ["Gebruik op werf", "Transporteerbaar formaat", "Korte of middellange verhuur", "Beschikbaar op offerte"], usage: ["Plaats op een stabiele ondergrond", "Laat lucht rond de machine circuleren", "Leeg of sluit de afvoer aan volgens gebruik", "Controleer regelmatig de droogvoortgang"] },
    en: { title: "Professional construction dehumidifier Dryfast DF800", description: "Professional dehumidifier for construction sites, drying after work, residual humidity or room drying.", features: ["Construction-site use", "Portable format", "Short or medium-term rental", "Available on request"], usage: ["Place on a stable surface", "Allow air to circulate around the machine", "Empty or connect the drain depending on use", "Check drying progress regularly"] }
  },
  "generateur-3000w": {
    nl: { title: "Benzinegenerator 3000 W", shortTitle: "Generator 3000 W", description: "Benzinegenerator voor tijdelijke stroomvoorziening op werven, buiteninterventies of eenmalige stroombehoefte.", features: ["Vermogen 3000 W", "Benzine", "Punctueel gebruik", "Toevoegen aan offertewagen"], usage: ["Alleen buiten of in een geventileerde zone gebruiken", "Brandstofniveau controleren", "Maximaal vermogen niet overschrijden", "Laten afkoelen vóór transport"] },
    en: { title: "Petrol generator 3000 W", shortTitle: "Generator 3000 W", description: "Petrol generator for temporary power on worksites, outdoor operations or occasional electricity needs.", features: ["3000 W power", "Petrol", "Occasional use", "Add to quote cart"], usage: ["Use only outdoors or in a ventilated area", "Check fuel level", "Do not exceed maximum power", "Allow to cool before transport"] }
  },
  "karcher-k5": { nl: { description: "Hogedrukreiniger voor buitenreiniging, terrassen, opritten, voertuigen en tuinmeubelen.", features: ["Max. druk ca. 145 bar", "Max. debiet ca. 500 l/u", "Watergekoelde motor", "Buitengebruik"], usage: ["Aansluiten op water", "Geschikte lans kiezen", "Eerst testen op een kleine zone", "Niet richten op personen of kwetsbare oppervlakken"] }, en: { description: "Pressure washer for outdoor cleaning, terraces, driveways, vehicles and garden furniture.", features: ["Max. pressure approx. 145 bar", "Max. flow approx. 500 l/h", "Water-cooled motor", "Outdoor use"], usage: ["Connect to water", "Choose the suitable lance", "Test on a small area first", "Do not aim at people or fragile surfaces"] } },
  "makita-duh602": { nl: { title: "Makita DUH602 heggenschaar 600 mm", shortTitle: "Makita DUH602", description: "Draadloze 18 V heggenschaar met 600 mm mes, geschikt voor hagen en nette afwerking.", features: ["18 V LXT", "Mes 600 mm", "Max. snijdikte ca. 21,5 mm", "Geleverd met 2 Makita 4Ah accu’s"], usage: ["Draag bril en handschoenen", "Controleer de haag vóór het snoeien", "Snoei geleidelijk", "Reinig het mes na gebruik"] }, en: { title: "Makita DUH602 hedge trimmer 600 mm", shortTitle: "Makita DUH602", description: "18 V cordless hedge trimmer with 600 mm blade, suitable for hedges and clean finishing work.", features: ["18 V LXT", "600 mm blade", "Max. cutting thickness approx. 21.5 mm", "Supplied with 2 Makita 4Ah batteries"], usage: ["Wear glasses and gloves", "Check the hedge before cutting", "Cut progressively", "Clean the blade after use"] } },
  "motobineuse-mtd-t380": { nl: { title: "MTD T380 motorhakfrees", description: "Thermische motorhakfrees voor grondvoorbereiding en veeleisende tuinwerken.", features: ["MTD benzinemotor", "Regelbare werkbreedte", "Frezen van 30,5 cm", "Tank ca. 2,2 l"], usage: ["Gebruiken op vrij terrein", "Brandstof en olie controleren", "Geleidelijk werken", "Frezen reinigen na gebruik"] }, en: { title: "MTD T380 tiller", description: "Petrol tiller for soil preparation and demanding garden work.", features: ["MTD petrol engine", "Adjustable working widths", "30.5 cm tines", "Approx. 2.2 l tank"], usage: ["Use on clear ground", "Check fuel and oil", "Work progressively", "Clean the tines after use"] } },
  "tarriere-makita-accu": { nl: { title: "Makita accugrondboor", shortTitle: "Makita accugrondboor", description: "Accugrondboor voor plantgaten, palen en kleine aanlegwerken.", features: ["Geleverd met 4 Makita 4Ah accu’s", "Makita 2-poorts lader", "Draadloos", "Buitengebruik"], usage: ["Bodem controleren vóór het boren", "Gereedschap stevig vasthouden", "Niet forceren bij stenen", "Accu’s opladen na gebruik"] }, en: { title: "Makita cordless earth auger", shortTitle: "Makita cordless auger", description: "Cordless auger for planting holes, posts and small landscaping jobs.", features: ["Supplied with 4 Makita 4Ah batteries", "Makita 2-port charger", "Cordless", "Outdoor use"], usage: ["Check the ground before drilling", "Hold the tool firmly", "Do not force if stones are present", "Recharge batteries after use"] } },
  "stihl-ap300s": { nl: { title: "STIHL AP300S accu", description: "Professionele STIHL AP accu voor compatibele machines uit het AP-systeem.", features: ["36 V", "Capaciteit 281 Wh", "Gewicht ca. 1,8 kg", "Laadniveau-leds"], usage: ["Gebruiken met compatibele machine", "Overmatige vochtigheid vermijden", "Opladen met geschikte STIHL-lader", "Droog bewaren"] }, en: { title: "STIHL AP300S battery", description: "Professional STIHL AP battery for compatible machines in the AP system.", features: ["36 V", "281 Wh capacity", "Weight approx. 1.8 kg", "Charge level LEDs"], usage: ["Use with compatible machine", "Avoid excessive humidity", "Charge with suitable STIHL charger", "Store dry"] } },
  "stihl-ap500s": { nl: { title: "STIHL AP500S accu", description: "STIHL AP accu met hoge capaciteit voor meer autonomie op compatibele machines.", features: ["36 V", "Capaciteit 337 Wh", "Gewicht ca. 2,0 kg", "Lithium-ion technologie"], usage: ["Gebruiken met compatibele STIHL AP-machine", "Laadniveau controleren", "Opladen met geschikte lader", "Vervoeren met bescherming"] }, en: { title: "STIHL AP500S battery", description: "High-capacity STIHL AP battery for extended runtime on compatible machines.", features: ["36 V", "337 Wh capacity", "Weight approx. 2.0 kg", "Lithium-ion technology"], usage: ["Use with compatible STIHL AP machine", "Check charge level", "Charge with suitable charger", "Transport with protection"] } },
  "makita-batterie-4ah": { nl: { title: "Makita 4Ah accu", shortTitle: "Makita 4Ah accu", description: "Makita 18 V 4Ah accu voor compatibele LXT-gereedschappen.", features: ["18 V", "4 Ah", "Compatibel met Makita LXT", "Indicator volgens model"], usage: ["Gebruiken met compatibel gereedschap", "Niet blootstellen aan water", "Opladen met Makita-lader", "Bewaren bij matige temperatuur"] }, en: { title: "Makita 4Ah battery", shortTitle: "Makita 4Ah battery", description: "Makita 18 V 4Ah battery for compatible LXT tools.", features: ["18 V", "4 Ah", "Compatible with Makita LXT range", "Indicator depending on model"], usage: ["Use with compatible tool", "Do not expose to water", "Charge with Makita charger", "Store at moderate temperature"] } }
};


function autoTranslateText(value: string | undefined, lang: Lang): string {
  if (!value || lang === "fr") return value || "";
  const nlPairs: [string, string][] = [
    ["Déshumidificateur de chantier", "Professionele bouwdroger"], ["professionnel", "professioneel"], ["Professionnel", "Professioneel"],
    ["Déshumidificateur", "Bouwdroger"], ["déshumidificateur", "bouwdroger"], ["chantier", "werf"], ["Chantier", "Werf"],
    ["Location", "Verhuur"], ["location", "verhuur"], ["matériel", "materiaal"], ["Matériel", "Materiaal"],
    ["Générateur", "Generator"], ["générateur", "generator"], ["essence", "benzine"], ["Nettoyeur haute pression", "Hogedrukreiniger"],
    ["Taille-haie", "Heggenschaar"], ["taille-haie", "heggenschaar"], ["Motobineuse", "Motorhakfrees"], ["motobineuse", "motorhakfrees"],
    ["Batterie", "Batterij"], ["batterie", "batterij"], ["sur accu", "op accu"], ["sans fil", "draadloos"],
    ["Prix à définir", "Prijs te bepalen"], ["Caution à définir", "Waarborg te bepalen"], ["Prix HTVA", "Prijs excl. btw"],
    ["Disponible", "Beschikbaar"], ["Méthode d’utilisation", "Gebruiksmethode"], ["Caractéristiques", "Kenmerken"],
    ["Usage extérieur", "Buitengebruik"], ["Format transportable", "Transporteerbaar formaat"], ["Usage chantier", "Werfgebruik"],
    ["Location courte ou moyenne durée", "Verhuur voor korte of middellange duur"], ["Disponible sur devis", "Beschikbaar op offerte"],
    ["Installer sur une surface stable", "Op een stabiele ondergrond plaatsen"], ["Laisser circuler l'air autour de la machine", "Laat lucht rond de machine circuleren"],
    ["Vider ou raccorder l'évacuation selon usage", "Leegmaken of afvoer aansluiten volgens gebruik"], ["Contrôler régulièrement la progression du séchage", "Controleer regelmatig de droogvoortgang"],
    ["test de langue", "taaltest"], ["de langue", "van taal"], ["pour", "voor"], ["avec", "met"], ["et", "en"], ["ou", "of"],
  ];
  const enPairs: [string, string][] = [
    ["Déshumidificateur de chantier", "Professional construction dehumidifier"], ["professionnel", "professional"], ["Professionnel", "Professional"],
    ["Déshumidificateur", "Dehumidifier"], ["déshumidificateur", "dehumidifier"], ["chantier", "construction site"], ["Chantier", "Construction site"],
    ["Location", "Rental"], ["location", "rental"], ["matériel", "equipment"], ["Matériel", "Equipment"],
    ["Générateur", "Generator"], ["générateur", "generator"], ["essence", "petrol"], ["Nettoyeur haute pression", "Pressure washer"],
    ["Taille-haie", "Hedge trimmer"], ["taille-haie", "hedge trimmer"], ["Motobineuse", "Tiller"], ["motobineuse", "tiller"],
    ["Batterie", "Battery"], ["batterie", "battery"], ["sur accu", "battery-powered"], ["sans fil", "cordless"],
    ["Prix à définir", "Price to be defined"], ["Caution à définir", "Deposit to be defined"], ["Prix HTVA", "Price excl. VAT"],
    ["Disponible", "Available"], ["Méthode d’utilisation", "How to use"], ["Caractéristiques", "Specifications"],
    ["Usage extérieur", "Outdoor use"], ["Format transportable", "Portable format"], ["Usage chantier", "Construction-site use"],
    ["Location courte ou moyenne durée", "Short or medium-term rental"], ["Disponible sur devis", "Available on quote"],
    ["Installer sur une surface stable", "Place on a stable surface"], ["Laisser circuler l'air autour de la machine", "Let air circulate around the machine"],
    ["Vider ou raccorder l'évacuation selon usage", "Empty or connect the drain depending on use"], ["Contrôler régulièrement la progression du séchage", "Regularly check drying progress"],
    ["test de langue", "language test"], ["de langue", "language"], ["pour", "for"], ["avec", "with"], ["et", "and"], ["ou", "or"],
  ];
  let out = value;
  for (const [from, to] of (lang === "nl" ? nlPairs : enPairs)) out = out.split(from).join(to);
  return out;
}

function autoTranslateList(value: string[] | undefined, lang: Lang): string[] {
  return (value || []).map((line) => autoTranslateText(line, lang));
}

function translatePriceText(value: string, lang: Lang): string {
  if (lang === "fr") return value;
  const dict = ui[lang];
  return value
    .replaceAll("Prix à définir", dict.priceToDefine)
    .replaceAll("Caution à définir", dict.cautionToDefine)
    .replaceAll("Prix HTVA", dict.priceExVat)
    .replaceAll("prix à définir selon durée", dict.priceDurationDefine)
    .replaceAll("Caution à définir selon durée et conditions", dict.cautionDurationDefine)
    .replaceAll("Disponible", dict.available)
    .replaceAll("à partir de", lang === "nl" ? "vanaf" : "from")
    .replaceAll("Caution", lang === "nl" ? "Waarborg" : "Deposit")
    .replaceAll("Week-end", lang === "nl" ? "Weekend" : "Weekend")
    .replaceAll("semaines", lang === "nl" ? "weken" : "weeks")
    .replaceAll("semaine", lang === "nl" ? "week" : "week")
    .replaceAll("jour", lang === "nl" ? "dag" : "day");
}

function sameSerialized(a: unknown, b: unknown) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function appendAdminExtra(baseFr: string | undefined, translatedBase: string | undefined, currentFr: string | undefined) {
  if (!currentFr) return translatedBase || currentFr || "";
  if (!baseFr || currentFr === baseFr) return translatedBase || currentFr;
  if (currentFr.startsWith(baseFr)) {
    const extra = currentFr.slice(baseFr.length).trim();
    return extra ? `${translatedBase || baseFr} ${extra}` : (translatedBase || currentFr);
  }
  // Sans API de traduction, on affiche le nouveau texte admin FR pour ne jamais masquer une modification.
  return currentFr;
}

function mergeListAdminExtra(baseFr: string[] | undefined, translatedBase: string[] | undefined, currentFr: string[] | undefined) {
  if (!currentFr?.length) return translatedBase || currentFr || [];
  const base = baseFr || [];
  const translated = translatedBase || base;
  if (sameSerialized(currentFr, base)) return translated;
  const result = [...translated];
  currentFr.forEach((line, index) => {
    if (index >= base.length || line !== base[index]) result[index] = line;
  });
  return result;
}

export function translateProduct(product: Product, lang: Lang): Product {
  const patch = productTranslations[product.id]?.[lang] || {};
  const original = baseProducts.find((item) => item.id === product.id);
  const translated: Product = {
    ...product,
    ...patch,
    fromPrice: translatePriceText(String(patch.fromPrice || product.fromPrice), lang),
    caution: translatePriceText(String(patch.caution || product.caution), lang),
    pricingRows: (patch.pricingRows || product.pricingRows)?.map((row) => translatePriceText(row, lang)),
  };

  if (!original) return translated;

  if (lang === "fr" || !productTranslations[product.id]?.[lang]) {
    (["title", "shortTitle", "description", "fromPrice", "caution"] as const).forEach((key) => {
      if (!sameSerialized(product[key], original[key])) {
        (translated as any)[key] = key === "fromPrice" || key === "caution" ? translatePriceText(String(product[key]), lang) : product[key];
      }
    });
    (["features", "usage", "pricingRows"] as const).forEach((key) => {
      if (!sameSerialized(product[key], original[key])) {
        (translated as any)[key] = key === "pricingRows" ? product[key]?.map((row: string) => translatePriceText(row, lang)) : product[key];
      }
    });
    return translated;
  }

  // NL/EN : garder les traductions existantes, mais traduire aussi les modifications admin FR via le dictionnaire local.
  translated.title = sameSerialized(product.title, original.title) ? translated.title : autoTranslateText(product.title, lang);
  translated.shortTitle = sameSerialized(product.shortTitle, original.shortTitle) ? translated.shortTitle : autoTranslateText(product.shortTitle, lang);
  translated.description = sameSerialized(product.description, original.description)
    ? (patch.description || translated.description)
    : autoTranslateText(product.description, lang);
  translated.features = sameSerialized(product.features, original.features)
    ? (patch.features || translated.features)
    : autoTranslateList(product.features, lang);
  translated.usage = sameSerialized(product.usage, original.usage)
    ? (patch.usage || translated.usage)
    : autoTranslateList(product.usage, lang);

  if (!sameSerialized(product.fromPrice, original.fromPrice)) translated.fromPrice = translatePriceText(String(product.fromPrice), lang);
  if (!sameSerialized(product.caution, original.caution)) translated.caution = translatePriceText(String(product.caution), lang);
  if (!sameSerialized(product.pricingRows, original.pricingRows)) translated.pricingRows = product.pricingRows?.map((row: string) => translatePriceText(row, lang));

  return translated;
}

export function t(lang: Lang, key: string): string {
  return ui[lang][key] || ui.fr[key] || key;
}
