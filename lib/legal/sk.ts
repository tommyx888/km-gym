import type { LegalContent } from './types';
import { site } from '../site';

const o = site.operator;
const email = site.contact.email || 'info@kmgym.sk';
const phone = site.contact.phone;
const gym = `${site.contact.address.street}, ${site.contact.address.zip} ${site.contact.address.city}`;
const operator = `${o.name}, so sídlom ${o.street}, ${o.zip} ${o.city}, IČO: ${o.ico}, DIČ: ${o.dic}, IČ DPH: ${o.icdph}, zapísaná v Obchodnom registri Mestského súdu Bratislava III`;
const L = site.legal;

export const sk: LegalContent = {
  /* ------------------------------------------------------------------ VOP */
  terms: {
    title: 'Všeobecné obchodné podmienky',
    lead: `Podmienky používania fitnescentra KM GYM a nákupu členstiev a vstupov. Účinné od ${new Date(L.effectiveDate).toLocaleDateString('sk-SK')}.`,
    sections: [
      {
        h: '1. Prevádzkovateľ a kontakt',
        p: [
          `Prevádzkovateľom fitnescentra KM GYM na adrese ${gym} (ďalej „fitnescentrum“) a predávajúcim je ${operator} (ďalej „prevádzkovateľ“).`,
          `Kontakt: ${email}, ${phone}. Orgán dozoru: Slovenská obchodná inšpekcia, Inšpektorát SOI pre Bratislavský kraj, Bajkalská 21/A, P. O. BOX 5, 820 07 Bratislava 27.`,
        ],
      },
      {
        h: '2. Služby a ceny',
        p: [
          'Prevádzkovateľ poskytuje prístup do fitnescentra a k jeho vybaveniu nonstop (24 hodín denne, 7 dní v týždni) na základe zakúpeného členstva (neobmedzený vstup na zvolené obdobie) alebo vstupu (jednorazový vstup, resp. permanentka na 10 vstupov).',
          'Aktuálne ceny sú uvedené v cenníku na webe kmgym.sk a v rezervačnom systéme. Všetky ceny sú konečné a uvedené vrátane DPH. Študentská cena platí pre študentov do 19 rokov po predložení dokladu o štúdiu pri prvej návšteve.',
          'Ak je pri cene uvedená zľava, uvádza sa aj najnižšia cena, za ktorú bola služba ponúkaná počas 30 dní pred poskytnutím zľavy.',
        ],
      },
      {
        h: '3. Objednávka a uzavretie zmluvy',
        p: [
          'Členstvá a vstupy sa kupujú online v rezervačnom systéme Reservine (kmgym.reservine.me), ktorý prevádzkovateľ využíva ako technického sprostredkovateľa. Pred odoslaním objednávky má kupujúci možnosť skontrolovať a zmeniť zadané údaje a oboznámiť sa s týmito podmienkami. Objednávka sa potvrdzuje tlačidlom s jasným označením, že s objednávkou je spojená povinnosť platby.',
          'Zmluva je uzavretá okamihom potvrdenia platby. Potvrdenie objednávky a daňový doklad sa zasielajú elektronicky na e-mail kupujúceho.',
          `Zmluvu môže samostatne uzavrieť osoba staršia ako ${L.minAgeMembership} rokov. Za mladšie osoby uzatvára zmluvu zákonný zástupca, ktorý zodpovedá za dodržiavanie prevádzkového poriadku.`,
        ],
      },
      {
        h: '4. Platba',
        p: [
          'Platba prebieha online platobnou kartou cez zabezpečenú platobnú bránu rezervačného systému. Prevádzkovateľ nemá prístup k údajom o platobnej karte.',
          'Členstvo alebo vstup je aktívny ihneď po pripísaní platby, od tohto momentu plynie jeho platnosť.',
        ],
      },
      {
        h: '5. Platnosť členstva a vstupov',
        ul: [
          'Mesačné členstvo platí 30 dní, 3‑mesačné 90 dní a ročné 365 dní odo dňa aktivácie. Členstvo sa neobnovuje automaticky a nie je spojené so žiadnou viazanosťou – po skončení si člen kupuje nové členstvo sám.',
          'Jednorazový vstup platí na jednu návštevu v rezervovanom čase. Permanentka na 10 vstupov platí 12 mesiacov od zakúpenia.',
          'Členstvo aj vstupy sú viazané na osobu kupujúceho a sú neprenosné. Nevyužité obdobie ani vstupy sa nevracajú, s výnimkou prípadov uvedených v týchto podmienkach alebo v zákone.',
          'Prevádzkovateľ môže platnosť členstva primerane predĺžiť, ak bolo fitnescentrum z dôvodov na jeho strane zatvorené viac ako 3 po sebe idúce dni.',
        ],
      },
      {
        h: '6. Rezervácia a vstup do fitnescentra',
        p: [
          'Fitnescentrum nemá recepciu. Každej návšteve predchádza rezervácia termínu v rezervačnom systéme (pre členov bezplatná). Pred začiatkom rezervácie dostane návštevník SMS a e‑mailom jednorazový PIN kód, ktorý zadá na klávesnici zámku vstupných dverí. PIN platí výlučne počas rezervovaného času a je osobný – jeho poskytnutie inej osobe alebo vpustenie cudzej osoby do priestorov je porušením týchto podmienok.',
          'Rezerváciu je možné bezplatne zrušiť alebo presunúť najneskôr 2 hodiny pred jej začiatkom. Pri zrušení sa jednorazový vstup alebo vstup z permanentky vráti na účet kupujúceho; členstvo nie je zrušením dotknuté. Pri neskoršom zrušení alebo nedostavení sa vstup prepadá.',
        ],
      },
      {
        h: '7. Odstúpenie od zmluvy (14 dní)',
        p: [
          'Kupujúci, ktorý je spotrebiteľom, má právo odstúpiť od zmluvy uzavretej na diaľku bez uvedenia dôvodu do 14 dní odo dňa uzavretia zmluvy. Odstúpenie môže zaslať e‑mailom na ' + email + ' alebo poštou na adresu prevádzkovateľa, a môže použiť vzorový formulár dostupný na webe v sekcii Dokumenty.',
          'Kupujúci zakúpením a aktiváciou členstva alebo vstupu výslovne žiada, aby sa poskytovanie služby začalo pred uplynutím lehoty na odstúpenie, a berie na vedomie, že po úplnom poskytnutí služby (napr. využitý jednorazový vstup) právo na odstúpenie stráca. Ak odstúpi od zmluvy v priebehu poskytovania služby, uhradí prevádzkovateľovi cenu zodpovedajúcu rozsahu služby poskytnutej do dňa doručenia odstúpenia (pri členstve pomernú časť za dni odo dňa aktivácie, pri permanentke cenu využitých vstupov podľa ceny jednorazového vstupu).',
          'Prevádzkovateľ vráti platbu, resp. jej zostávajúcu časť, do 14 dní od doručenia odstúpenia rovnakým spôsobom, akým bola vykonaná, ak sa s kupujúcim nedohodne inak.',
        ],
      },
      {
        h: '8. Povinnosti návštevníka',
        ul: [
          'Dodržiavať Prevádzkový poriadok fitnescentra (zverejnený na webe a v priestoroch fitnescentra) a pokyny prevádzkovateľa.',
          'Cvičiť na vlastnú zodpovednosť, s ohľadom na svoj zdravotný stav a schopnosti, a používať zariadenie len spôsobom, na ktorý je určené.',
          'Neposkytovať PIN kód iným osobám a nevpúšťať do priestorov osoby bez vlastnej rezervácie.',
          'Nahradiť škodu, ktorú na zariadení alebo priestoroch spôsobí úmyselne alebo z nedbanlivosti.',
        ],
      },
      {
        h: '9. Zodpovednosť prevádzkovateľa',
        p: [
          'Prevádzkovateľ zodpovedá za technický stav zariadenia a priestorov. Nezodpovedá za ujmu na zdraví spôsobenú nesprávnym používaním zariadenia, precenením vlastných síl alebo porušením prevádzkového poriadku, ani za veci odložené mimo uzamykateľných skriniek. Fitnescentrum je poistené pre prípad zodpovednosti za škodu spôsobenú prevádzkou.',
        ],
      },
      {
        h: '10. Porušenie podmienok',
        p: [
          'Pri závažnom alebo opakovanom porušení týchto podmienok alebo prevádzkového poriadku (najmä vpustenie cudzej osoby, poškodzovanie zariadenia, ohrozovanie ostatných) je prevádzkovateľ oprávnený členstvo zrušiť bez nároku na vrátenie ceny za nevyužité obdobie a odmietnuť ďalší vstup.',
        ],
      },
      {
        h: '11. Reklamácie a riešenie sporov',
        p: [
          'Reklamácie sa riadia Reklamačným poriadkom zverejneným na webe. Spotrebiteľ má právo obrátiť sa na prevádzkovateľa so žiadosťou o nápravu, ak nie je spokojný s vybavením reklamácie alebo sa domnieva, že boli porušené jeho práva. Ak prevádzkovateľ žiadosť zamietne alebo na ňu neodpovie do 30 dní, spotrebiteľ môže podať návrh na začatie alternatívneho riešenia sporu podľa zákona č. 391/2015 Z. z. subjektu alternatívneho riešenia sporov, ktorým je Slovenská obchodná inšpekcia (www.soi.sk) alebo iná oprávnená právnická osoba zapísaná v zozname Ministerstva hospodárstva SR.',
        ],
      },
      {
        h: '12. Záverečné ustanovenia',
        p: [
          'Vzťahy neupravené týmito podmienkami sa riadia právnym poriadkom Slovenskej republiky, najmä Občianskym zákonníkom, zákonom č. 108/2024 Z. z. o ochrane spotrebiteľa a zákonom č. 391/2015 Z. z. o alternatívnom riešení spotrebiteľských sporov.',
          'Prevádzkovateľ môže tieto podmienky meniť; pre kupujúceho platí znenie účinné v deň uzavretia zmluvy. Aktuálne znenie je vždy dostupné na webe kmgym.sk.',
        ],
      },
    ],
  },

  /* --------------------------------------------------------------- GDPR */
  privacy: {
    title: 'Ochrana osobných údajov',
    lead: `Informácie o spracúvaní osobných údajov podľa čl. 13 a 14 nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. Účinné od ${new Date(L.effectiveDate).toLocaleDateString('sk-SK')}.`,
    sections: [
      {
        h: '1. Prevádzkovateľ',
        p: [`${operator}. Kontakt vo veciach osobných údajov: ${email}, ${phone}. Zodpovedná osoba nie je určená (nevyžaduje sa).`],
      },
      {
        h: '2. Aké údaje spracúvame, na aký účel a na akom právnom základe',
        dl: [
          ['Registrácia a členská zóna na webe', 'E‑mail, meno, telefón, zvolený jazyk, stav členstva, pozývací kód do tréningového denníka, prihlasovacie záznamy. Účel: vedenie členského účtu a sprístupnenie členských funkcií. Právny základ: plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR).'],
          ['Nákup členstva a vstupov, rezervácie, vstup do fitnescentra', 'Meno, e‑mail, telefón, údaje o zakúpených službách a rezerváciách, čas vstupu a vygenerované PIN kódy. Účel: uzavretie a plnenie zmluvy, otvorenie dverí, evidencia využitia služieb. Právny základ: plnenie zmluvy (čl. 6 ods. 1 písm. b)). Platobné údaje spracúva platobná brána; prevádzkovateľ ich nevidí.'],
          ['Účtovníctvo a daňové doklady', 'Fakturačné údaje a údaje o platbách. Právny základ: plnenie zákonných povinností (čl. 6 ods. 1 písm. c) – zákon o účtovníctve, zákon o DPH).'],
          ['Kamerový systém', `Obrazový záznam priestorov fitnescentra (vstup, tréningové zóny; nie šatne a sprchy). Účel: ochrana majetku, bezpečnosť osôb, objasnenie incidentov a kontrola dodržiavania podmienok vstupu v prevádzke bez recepcie. Právny základ: oprávnený záujem prevádzkovateľa (čl. 6 ods. 1 písm. f)). Priestory sú označené piktogramom pri vstupe.`],
          ['Kontaktný formulár a e‑mailová komunikácia', 'Meno, e‑mail, telefón, zvolené členstvo, správa. Účel: vybavenie požiadavky. Právny základ: oprávnený záujem na komunikácii so záujemcom, resp. predzmluvné rokovania (čl. 6 ods. 1 písm. b) a f)).'],
          ['Tréningový denník (dennik.kmgym.sk)', 'Dobrovoľná služba pre členov. Pri registrácii passkey (kryptografický kľúč viazaný na zariadenie), zvolené meno profilu, a údaje, ktoré si člen sám zapisuje (tréningy, hmotnosť, prípadne fotografie). Účel: poskytnutie denníka. Právny základ: plnenie zmluvy; citlivejšie údaje o zdraví (hmotnosť, výkonnosť) spracúvame na základe výslovného súhlasu udeleného ich zapísaním (čl. 9 ods. 2 písm. a)), ktorý možno kedykoľvek odvolať vymazaním údajov alebo účtu.'],
          ['Transakčné e‑maily', 'E‑mailová adresa a obsah správ (potvrdenie registrácie, obnova hesla, potvrdenie rezervácie a PIN). Právny základ: plnenie zmluvy.'],
        ],
      },
      {
        h: '3. Príjemcovia a sprostredkovatelia',
        p: ['Údaje spracúvajú v mene prevádzkovateľa títo sprostredkovatelia, s ktorými sú uzavreté zmluvy o spracúvaní osobných údajov:'],
        ul: [
          'Reservine (rezervačný systém, platby, generovanie PIN kódov do zámku) a jeho platobná brána – servery v EÚ.',
          'TTLock / Sciener (cloud inteligentného zámku vstupných dverí) – spracúva PIN kódy a čas otvorenia; prevádzkovateľ zámku môže údaje spracúvať aj mimo EÚ na základe štandardných zmluvných doložiek.',
          'Supabase (databáza a prihlasovanie členskej zóny) – servery v EÚ.',
          'Vercel (hosting webu) a Railway (hosting tréningového denníka) – servery v EÚ (Frankfurt / Amsterdam).',
          'Resend (odosielanie e‑mailov).',
          'Externá účtovná spoločnosť a poskytovateľ kamerového systému (servis). Záznam z kamier môže byť poskytnutý orgánom činným v trestnom konaní alebo poisťovni pri riešení incidentu.',
        ],
      },
      {
        h: '4. Doba uchovávania',
        ul: [
          'Údaje členského účtu – počas trvania registrácie a 12 mesiacov po poslednom prihlásení alebo skončení členstva, potom sa účet vymaže. Účet si môže člen zrušiť kedykoľvek žiadosťou na ' + email + '.',
          'Údaje o rezerváciách a vstupoch – 12 mesiacov od uskutočnenia.',
          'Účtovné a daňové doklady – 10 rokov podľa zákona o účtovníctve.',
          `Kamerový záznam – ${L.cameraRetentionDays} dní, potom sa automaticky prepisuje; pri incidente sa príslušná časť uchová do jeho vyriešenia.`,
          'Správy z kontaktného formulára – 6 mesiacov od vybavenia.',
          'Tréningový denník – kým člen údaje alebo účet sám nevymaže; neaktívne účty sa po skončení členstva deaktivujú a po 12 mesiacoch vymažú.',
        ],
      },
      {
        h: '5. Práva dotknutej osoby',
        p: ['Máš právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania, prenosnosť (pri údajoch spracúvaných na základe zmluvy alebo súhlasu), právo namietať proti spracúvaniu na základe oprávneného záujmu (vrátane kamerového systému) a právo kedykoľvek odvolať súhlas bez vplyvu na zákonnosť predchádzajúceho spracúvania.', `Žiadosti vybavujeme do 30 dní na ${email}. Ak sa domnievaš, že spracúvanie porušuje právne predpisy, máš právo podať sťažnosť Úradu na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava 27, www.dataprotection.gov.sk.`],
      },
      {
        h: '6. Automatizované rozhodovanie a profilovanie',
        p: ['Prevádzkovateľ nevykonáva automatizované rozhodovanie s právnym účinkom ani profilovanie. PIN kód do dverí sa generuje automaticky výlučne na základe platnej rezervácie.'],
      },
      {
        h: '7. Zabezpečenie',
        p: ['Údaje sú prenášané šifrovane (HTTPS), prihlasovanie do členskej zóny je chránené heslom a do denníka passkey technológiou. Prístup k údajom majú len poverené osoby prevádzkovateľa v rozsahu nevyhnutnom na ich úlohy.'],
      },
    ],
  },

  /* ------------------------------------------------------------ Cookies */
  cookies: {
    title: 'Cookies',
    lead: 'Ako používame cookies a podobné technológie na webe kmgym.sk.',
    sections: [
      {
        h: '1. Nevyhnutné technické údaje (bez súhlasu)',
        ul: [
          'km_locale – zvolený jazyk webu (cookie, 12 mesiacov).',
          'km_theme – zvolený tmavý/svetlý vzhľad (localStorage, kým ho nezmeníš).',
          'km_consent – tvoja voľba v cookie lište, ak sa zobrazí (localStorage, 12 mesiacov).',
          'Prihlasovacie cookies členskej zóny (sb-…-auth-token) – udržiavajú prihlásenie; platia do odhlásenia, najviac 7 dní bez aktivity.',
        ],
        p: ['Tieto údaje sú nevyhnutné na fungovanie webu, neslúžia na sledovanie a nevyžadujú súhlas (§ 109 ods. 8 zákona č. 452/2021 Z. z. o elektronických komunikáciách).'],
      },
      {
        h: '2. Analytické a marketingové cookies (len so súhlasom)',
        p: [
          site.analytics.gaId || site.analytics.metaPixelId
            ? 'Web používa nástroje na meranie návštevnosti (Google Analytics) a prípadne marketingové nástroje (Meta Pixel). Načítajú sa výlučne po kliknutí na „Súhlasím“ v cookie lište. Odmietnutie je rovnako jednoduché ako súhlas a web funguje bez obmedzení. Voľbu môžeš kedykoľvek zmeniť odkazom „Nastavenia cookies“ v päte stránky.'
            : 'Web momentálne nepoužíva žiadne analytické ani marketingové cookies (Google Analytics, Meta Pixel a pod.). Ak ich v budúcnosti nasadíme, načítajú sa až po tvojom výslovnom súhlase v cookie lište, s rovnako dostupnou možnosťou odmietnuť.',
        ],
      },
      {
        h: '3. Služby tretích strán',
        p: ['Rezervačný systém Reservine (kmgym.reservine.me) a tréningový denník (dennik.kmgym.sk) sú samostatné stránky s vlastnými nevyhnutnými cookies. Mapa na stránke Kontakt sa načítava z Google Maps až po tvojej interakcii.'],
      },
    ],
  },

  /* ---------------------------------------------------------- Reklamácie */
  complaints: {
    title: 'Reklamačný poriadok',
    lead: `Postup pri uplatnení práv zo zodpovednosti za vady služieb KM GYM. Účinný od ${new Date(L.effectiveDate).toLocaleDateString('sk-SK')}.`,
    sections: [
      {
        h: '1. Všeobecné ustanovenia',
        p: [`Tento reklamačný poriadok upravuje postup pri reklamácii služieb poskytovaných prevádzkovateľom ${o.name} (${gym}) v súlade s Občianskym zákonníkom a zákonom č. 108/2024 Z. z. o ochrane spotrebiteľa.`],
      },
      {
        h: '2. Čo možno reklamovať',
        ul: [
          'Nefunkčnosť vstupu (PIN kód neotvoril dvere v rezervovanom čase) – kontaktuj nás ihneď telefonicky, vstup ti vrátime alebo členstvo predĺžime.',
          'Nedostupnosť fitnescentra alebo podstatnej časti vybavenia počas platnosti členstva z dôvodov na strane prevádzkovateľa.',
          'Nesprávne účtovaná cena alebo nesprávne aktivované členstvo či vstupy.',
        ],
      },
      {
        h: '3. Uplatnenie reklamácie',
        p: [
          `Reklamáciu uplatni bez zbytočného odkladu, najneskôr do 24 mesiacov od poskytnutia služby, e‑mailom na ${email}, telefonicky na ${phone} alebo písomne na adresu prevádzkovateľa. Uveď meno, e‑mail použitý pri nákupe, dátum a čas rezervácie a popis problému.`,
          'Prevádzkovateľ vydá potvrdenie o uplatnení reklamácie (e‑mailom) a rozhodne o nej ihneď, v zložitých prípadoch do 3 pracovných dní; vybavenie reklamácie nesmie trvať dlhšie ako 30 dní od jej uplatnenia. O vybavení informuje spotrebiteľa písomne (e‑mailom).',
        ],
      },
      {
        h: '4. Spôsob vybavenia',
        ul: [
          'Oprávnená reklamácia sa vybaví náhradným vstupom, predĺžením platnosti členstva o dotknuté obdobie, primeranou zľavou alebo vrátením ceny, resp. jej pomernej časti, podľa voľby spotrebiteľa a povahy vady.',
          'Vrátenie platby sa vykoná do 14 dní od vybavenia reklamácie na platobnú kartu, ktorou bola platba vykonaná, ak sa nedohodne inak.',
          'Reklamáciu nemožno uznať, ak vada vznikla porušením prevádzkového poriadku, nesprávnym používaním zariadenia alebo nedostavením sa na rezerváciu.',
        ],
      },
      {
        h: '5. Alternatívne riešenie sporov',
        p: ['Ak spotrebiteľ nie je spokojný s vybavením reklamácie alebo sa domnieva, že prevádzkovateľ porušil jeho práva, môže sa obrátiť na prevádzkovateľa so žiadosťou o nápravu a následne podať návrh na alternatívne riešenie sporu Slovenskej obchodnej inšpekcii (www.soi.sk, ars@soi.sk) alebo inému subjektu zo zoznamu Ministerstva hospodárstva SR, podľa zákona č. 391/2015 Z. z.'],
      },
    ],
  },

  /* ----------------------------------------------------- Prevádzkový poriadok */
  operating: {
    title: 'Prevádzkový poriadok',
    lead: `Pravidlá vstupu, bezpečnosti a hygieny vo fitnescentre KM GYM, ${gym}. Platí pre každého návštevníka. Účinný od ${new Date(L.effectiveDate).toLocaleDateString('sk-SK')}.`,
    sections: [
      {
        h: '1. Prevádzka a vstup',
        ul: [
          'Fitnescentrum je otvorené nonstop, bez obsluhy. Vstup je možný len s platnou rezerváciou a osobným PIN kódom, ktorý platí počas rezervovaného času.',
          'PIN kód je neprenosný. Je zakázané vpúšťať do priestorov iné osoby alebo im kód poskytnúť. Každý návštevník musí mať vlastnú rezerváciu.',
          `Samostatný vstup je povolený od ${L.minAgeAlone} rokov. Mladšie osoby môžu cvičiť len v sprievode dospelej osoby s vlastnou rezerváciou.`,
          'Pri odchode skontroluj, či sa vstupné dvere zatvorili a zamkli.',
          'Priestory sú monitorované kamerovým systémom so záznamom (okrem šatní a spŕch) na účely bezpečnosti a ochrany majetku – podrobnosti v dokumente Ochrana osobných údajov.',
        ],
      },
      {
        h: '2. Bezpečnosť',
        ul: [
          'Cvičíš na vlastnú zodpovednosť. Ak máš zdravotné obmedzenia, poraď sa vopred s lekárom. Pri nevoľnosti alebo zranení prestaň cvičiť a volaj 112; núdzový kontakt prevádzkovateľa: ' + phone + '.',
          'Lekárnička je umiestnená pri vstupe. [DOPLNIŤ – presné miesto]',
          'Používaj zariadenie len spôsobom, na ktorý je určené. Pri veľkých váhach používaj bezpečnostné zarážky stojana alebo dopomoc. Nepreťažuj stroje nad uvedenú nosnosť.',
          'Je zakázaný vstup pod vplyvom alkoholu alebo návykových látok, fajčenie a manipulácia s otvoreným ohňom.',
          'Zistené poškodenie zariadenia ihneď nahlás telefonicky alebo e‑mailom; poškodené zariadenie nepoužívaj.',
        ],
      },
      {
        h: '3. Hygiena a poriadok',
        ul: [
          'Vstup do tréningových zón len v čistej športovej obuvi určenej do interiéru.',
          'Na lavičky a stroje používaj uterák; po tréningu zariadenie utri dezinfekciou, ktorá je k dispozícii.',
          'Po cvičení vráť činky, kotúče a náradie na určené miesto.',
          'Šatne a sprchy udržiavaj v čistote. Odložené veci si zamkni do skrinky; za veci odložené mimo skriniek prevádzkovateľ nezodpovedá.',
          'Nápoje len v uzatvárateľných fľašiach; sklo nie je povolené.',
        ],
      },
      {
        h: '4. Ohľaduplnosť',
        ul: [
          'Správaj sa ohľaduplne k ostatným, nehádž činky na zem, nefoť a nenahrávaj iné osoby bez ich súhlasu.',
          'Hudbu počúvaj len cez slúchadlá.',
          'Rešpektuj rezervovaný čas; ak chceš cvičiť dlhšie, predĺž si rezerváciu v aplikácii.',
        ],
      },
      {
        h: '5. Porušenie poriadku',
        p: ['Pri porušení tohto poriadku môže prevádzkovateľ návštevníka vyzvať na opustenie priestorov, zrušiť členstvo bez nároku na vrátenie ceny za nevyužité obdobie a požadovať náhradu spôsobenej škody. Závažné prípady (vpustenie cudzej osoby, krádež, vandalizmus) budú riešené aj s políciou s využitím kamerového záznamu.'],
      },
    ],
  },

  /* -------------------------------------------------------- Odstúpenie */
  withdrawal: {
    title: 'Formulár na odstúpenie od zmluvy',
    lead: 'Vyplň a pošli len v prípade, že chceš odstúpiť od zmluvy uzavretej na diaľku do 14 dní od nákupu. Formulár môžeš vytlačiť alebo skopírovať do e‑mailu.',
    sections: [
      {
        h: 'Komu',
        p: [`${o.name}, ${o.street}, ${o.zip} ${o.city}, e‑mail: ${email}`],
      },
      {
        h: 'Oznámenie o odstúpení od zmluvy',
        p: [
          'Týmto oznamujem, že odstupujem od zmluvy o poskytnutí tejto služby: ……………………………………………… (členstvo / vstup, názov balíka)',
          'Dátum objednania / zaplatenia: ………………………',
          'Meno a priezvisko spotrebiteľa: ………………………………………………',
          'Adresa spotrebiteľa: ………………………………………………',
          'E‑mail použitý pri nákupe: ………………………………………………',
          'Podpis spotrebiteľa (iba ak sa formulár podáva v listinnej podobe): ………………………',
          'Dátum: ………………………',
        ],
      },
      {
        h: 'Poučenie',
        p: [
          'Lehota na odstúpenie je 14 dní odo dňa uzavretia zmluvy (zaplatenia). Lehota je zachovaná, ak oznámenie odošleš v jej posledný deň.',
          'Ak si požiadal o začatie poskytovania služby počas tejto lehoty (aktivácia členstva alebo vstupu ihneď po zaplatení), uhradíš cenu za službu poskytnutú do dňa odstúpenia; po úplnom poskytnutí služby (využitý vstup) právo na odstúpenie zaniká. Platbu, resp. jej zostatok, ti vrátime do 14 dní rovnakým spôsobom, akým bola vykonaná.',
        ],
      },
    ],
  },
};
