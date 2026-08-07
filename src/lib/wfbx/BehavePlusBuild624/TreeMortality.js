
//------------------------------------------------------------------------------
//  FOFEM tree species and equations
//  These are used in the bark thickness and tree mortality functions.
//  Note: Region 1=Interior West, 2=Pacific West, 3=NorthEast, 4=SouthEast.
//
//  NOTE: FOFEM v6 introduced new species codes for all species, and also
//	introduced 13 new species and dropped 2 other species.
//	The FOFEM 6 abbreviations are under structure member named 'fofem6', while
//  the FOFEM 5 abbreviations are under structure member named 'fofem5' (was 'abbrev').
//  The order of the original FOFEM 5 species indices have not changed,
//	since those are hard-wired referenced into client code.
//
//  NOTE: Through BP5, there were only mortality equations 1 and 3.
//  With BP6 we introiduce mortality equations 10 through 20.
//------------------------------------------------------------------------------

typedef struct _fofemSpecies
{
	char *fofem6;		// FOFEM 6 genus-species abbreviation
    char *fofem5;       // FOFEM 5 genus-species abbreviation
    int   mortEq;       // Index to mortality equation (base 1): 1, 3, and 10-20
    int   barkEq;       // Index to single bark thickness equation (base 1)
    int   regions;      // Region list (any combination of 1, 2, 3, and/or 4)
    char *scientific;   // Scientific name
    char *common;       // Common name
} FofemSpeciesStruct;

static FofemSpeciesStruct FofemSpecies[] =
{
/* 000 */ { "ABAM",   "ABIAMA",  1, 26,    2, "Abies amabilis",               "Pacific silver fir" },
/* 001 */ { "ABBA",   "ABIBAL",  1, 10,  134, "Abies balsamea",               "Balsam fir" },
/* 002 */ { "ABCO",   "ABICON", 10, 27,   12, "Abies concolor",               "White fir" },
/* 003 */ { "ABGR",   "ABIGRA", 11, 25,   12, "Abies grandis",                "Grand fir" },
/* 004 */ { "ABLA",   "ABILAS", 11, 20,   12, "Abies lasiocarpa",             "Subalpine fir" },
/* 005 */ { "ABMA",   "ABIMAG", 16, 18,   12, "Abies magnifica",              "Red fir" },
/* 006 */ { "ABPR",   "ABIPRO",  1, 24,    2, "Abies procera",                "Noble fir" },
/* 007 */ { "ABISPP", "ABISPP",  1, 30,   34, "Abies species",                "Firs" },
/* 008 */ { "ACBA3",  "ACEBAR",  1,  8,    4, "Acer barbatum",                "Southern sugar maple" },
/* 009 */ { "ACLE",   "ACELEU",  1,  8,    4, "Acer leucoderme",              "Chalk maple" },
/* 010 */ { "ACMA3",  "ACEMAC",  1,  3,    2, "Acer macrophyllum",            "Bigleaf maple" },
/* 011 */ { "ACNE2",  "ACENEG",  1, 13,   34, "Acer negundo",                 "Boxelder" },
/* 012 */ { "ACNI5",  "ACENIG",  1, 14,   34, "Acer nigrum",                  "Black maple" },
/* 013 */ { "ACPE",   "ACEPEN",  1, 24,   34, "Acer pensylvanicum",           "Striped maple" },
/* 014 */ { "ACRU",   "ACERUB",  1,  7,   34, "Acer rubrum",                  "Red maple" },
/* 015 */ { "ACSA2",  "ACESACI", 1, 10,   34, "Acer saccharinum",             "Silver maple" },
/* 016 */ { "ACSA3",  "ACESACU", 1, 12,   34, "Acer saccharum",               "Sugar maple" },
/* 017 */ { "ACESPP", "ACESPI",  1, 19,    3, "Acer spicatum",                "Mountain maple" },
/* 018 */ { "ACSP2",  "ACESPP",  1,  8,   34, "Acer species",                 "Maples" },
/* 019 */ { "AEGL",   "AESGLA",  1, 15,   34, "Aesculus glabra",              "Ohio buckeye" },
/* 020 */ { "AEOC2",  "AESOCT",  1, 29,   34, "Aesculus octandra",            "Yellow buckeye" },
/* 021 */ { "AIAL",   "AILALT",  1, 29,   34, "Ailanthus altissima",          "Ailanthus" },
/* 022 */ { "ALRH2",  "ALNRHO",  1, 35,    2, "Alnus rhombifolia",            "White alder" },
/* 023 */ { "ALRU2",  "ALNRUB",  1,  5,    2, "Alnus rubra",                  "Red alder" },
/* 024 */ { "AMAR3",  "AMEARB",  1, 29,   34, "Amelanchier arborea",          "Common serviceberry" },
/* 025 */ { "ARME",   "ARBMEN",  1, 34,    2, "Arbutus menziesii",            "Pacific madrone" },
/* 026 */ { "BEAL2",  "BETALL",  1, 10,   34, "Betula alleghaniensis",        "Yellow birch" },
/* 027 */ { "BELE",   "BETLEN",  1,  9,    4, "Betula lenta",                 "Sweet birch" },
/* 028 */ { "BENI",   "BETNIG",  1,  8,   34, "Betula nigra",                 "River birch" },
/* 029 */ { "BEOC2",  "BETOCC",  1, 29,   34, "Betula occidentalis",          "Water birch" },
/* 030 */ { "BEPA",   "BETPAP",  1,  6,  234, "Betula papyrifera",            "Paper birch" },
/* 031 */ { "BETSPP", "BETSPP",  1, 12,  234, "Betula species ",              "Birches" },
/* 032 */ { "CEOC",   "CELOCC",  1, 14,   34, "Celtis occidentalis",          "Common hackberry" },
/* 033 */ { "CAAQ2",  "CARAQU",  1, 19,   34, "Carya aquatica",               "Water hickory" },
/* 034 */ { "CACA18", "CARCAR",  1,  9,   34, "Carpinus caroliniana",         "American hornbeam" },
/* 035 */ { "CACOL3", "CARCOR",  1, 16,   34, "Carya cordiformis",            "Bitternut hickory" },
/* 036 */ { "CAGL8",  "CARGLA",  1, 16,   34, "Carya glabra",                 "Pignut hickory" },
/* 037 */ { "CAIL2",  "CARILL",  1, 15,   34, "Carya illinoensis",            "Pecan" },
/* 038 */ { "CALA21", "CARLAC",  1, 22,   34, "Carya laciniosa",              "Shellbark hickory" },
/* 039 */ { "CAOV2",  "CAROVA",  1, 19,   34, "Carya ovata",                  "Shagbark hickory" },
/* 040 */ { "CARSPP", "CARSPP",  1, 23,   34, "Carya species",                "Hickories" },
/* 041 */ { "CATE9",  "CARTEX",  1, 19,    4, "Carya texana",                 "Black hickory" },
/* 042 */ { "CATO6",  "CARTOM",  1, 22,   34, "Carya tomentosa",              "Mockernut hickory" },
/* 043 */ { "CACHM",  "CASCHR",  1, 24,    2, "Castanopsis chrysophylla",     "Giant chinkapin" },
/* 044 */ { "CADE12", "CASDEN",  1, 19,    3, "Castanea dentata",             "American chestnut" },
/* 045 */ { "CATSPP", "CATSPP",  1, 16,    4, "Catalpa species",              "Catalpas" },
/* 046 */ { "CELA",   "CELLAE",  1, 15,   34, "Celtis laevigata",             "Sugarberry" },
/* 047 */ { "CECA4",  "CERCAN",  1, 14,   34, "Cercis canadensis",            "Eastern redbud" },
/* 048 */ { "CHLA",   "CHALAW",  1, 39,    2, "Chamaecyparis lawsoniana",     "Port Orford cedar" },
/* 049 */ { "CHNO",   "CHANOO",  1,  2,    2, "Chamaecyparis nootkatenis",    "Alaska cedar" },
/* 050 */ { "CHTH2",  "CHATHY",  1,  4,   34, "Chamaecyparis thyoides",       "Atlantic white cedar" },
/* 051 */ { "COFL2",  "CORFLO",  1, 20,   34, "Cornus florida",               "Flowering dogwood" },
/* 052 */ { "CONU4",  "CORNUT",  1, 35,    2, "Cornus nuttallii",             "Pacific dogwood" },
/* 053 */ { "CORSPP", "CORSPP",  1, 10,   34, "Cornus species",               "Dogwoods" },
/* 054 */ { "CRDO2",  "CRADOU",  1, 17,    4, "Crataegus douglasii",          "Black hawthorn" },
/* 055 */ { "CRASPP", "CRASPPW", 1, 35,    2, "Crataegus species (western)",  "Hawthorns (western)" },
/* 056 */ { "",       "CRASPPE", 1, 17,   34, "Crataegus species (eastern)",  "Hawthorns (eastern)" },
/* 057 */ { "DIVI5",  "DIOVIR",  1, 20,   34, "Diospyros virginiana",         "Persimmon" },
/* 058 */ { "FAGR",   "FAGGRA",  1,  4,   34, "Fagus grandifolia",            "American beech" },
/* 059 */ { "FRAM2",  "FRAAMA",  1, 21,   34, "Fraxinus americana",           "White ash" },
/* 060 */ { "FRNI",   "FRANIG",  1, 14,   34, "Fraxinus nigra",               "Black ash" },
/* 061 */ { "FRPE",   "FRAPEN",  1, 18,   34, "Fraxinus pennsylvanica",       "Green ash" },
/* 062 */ { "FRPR",   "FRAPRO",  1, 16,   34, "Fraxinus profunda",            "Pumpkin ash" },
/* 063 */ { "FRQU",   "FRAQUA",  1,  9,   34, "Fraxinus quadrangulata",       "Blue ash" },
/* 064 */ { "FRASPP", "FRASPP",  1, 21,   34, "Fraxinus species",             "Ashes" },
/* 065 */ { "GLTR",   "GLETRI",  1, 17,   34, "Gleditsia triacanthos",        "Honeylocust" },
/* 066 */ { "GOLA",   "GORLAS",  1, 17,    4, "Gordonia lasianthus",          "Loblolly bay" },
/* 067 */ { "GYDI",   "GYMDIO",  1, 10,   34, "Gymnocladus dioicus",          "Kentucky coffeetree" },
/* 068 */ { "HALSPP", "HALSPP",  1, 17,    4, "Halesia species",              "Silverbells" },
/* 069 */ { "ILOP",   "ILEOPA",  1, 21,   34, "Ilex opaca",                   "American holly" },
/* 070 */ { "JUCI",   "JUGCIN",  1, 20,   34, "Juglans cinerea",              "Butternut" },
/* 071 */ { "JUNI",   "JUGNIG",  1, 20,   34, "Juglans nigra",                "Black walnut" },
/* 072 */ { "JUOC",   "JUNOCC",  1,  4,    2, "Juniperus occidentalis",       "Western juniper" },
/* 073 */ { "JUNSPP", "JUNSPP",  1, 12,   34, "Juniperus species",            "Junipers/Redcedars" },
/* 074 */ { "JUVI",   "JUNVIR",  1, 17,   34, "Juniperus virginiana",         "Eastern redcedar" },
/* 075 */ { "LALA",   "LARLAR",  1, 10,   34, "Larix laricina",               "Tamarack" },
/* 076 */ { "LALY",   "LARLYA",  1, 29,    2, "Larix lyallii",                "Subalpine larch" },
/* 077 */ { "LAOC",   "LAROCC", 14, 36,   12, "Larix occidentalis",           "Western larch" },
/* 078 */ { "LIDE",   "LIBDEC", 12, 34,    2, "Libocedrus decurrens",         "Incense cedar" },
/* 079 */ { "LIST2",  "LIQSTY",  1, 15,   34, "Liquidambar styraciflua",      "Sweetgum" },
/* 080 */ { "LITU",   "LIRTUL",  1, 20,   34, "Liriodendron tulipifera",      "Yellow poplar" },
/* 081 */ { "LIDE3",  "LITDEN",  1, 30,    2, "Lithocarpus densiflorus",      "Tanoak" },
/* 082 */ { "MAPO",   "MACPOM",  1, 16,    4, "Maclura pomifera",             "Osage orange" },
/* 083 */ { "MAAC",   "MAGACU",  1, 15,   34, "Magnolia acuminata",           "Cucumber tree" },
/* 084 */ { "MAGR4",  "MAGGRA",  1, 12,    4, "Magnolia grandiflora",         "Southern magnolia" },
/* 085 */ { "MAMA2",  "MAGMAC",  1, 12,    4, "Magnolia macrophylla",         "Bigleaf magnolia" },
/* 086 */ { "MAGSPP", "MAGSPP",  1, 18,   34, "Magnolia species",             "Magnolias" },
/* 087 */ { "MAVI2",  "MAGVIR",  1, 19,   34, "Magnolia virginiana",          "Sweetbay" },
/* 088 */ { "MALPRU", "MALPRU",  1, 17,    4, "Prunus species",               "Apples/Cherries" },
/* 089 */ { "MALSPP", "MALSPP",  1, 22,   34, "Malus species",                "Apples" },
/* 090 */ { "MOAL",   "MORALB",  1, 17,    4, "Morus alba",                   "White mulberry" },
/* 091 */ { "MORU2",  "MORRUB",  1, 17,    4, "Morus rubra",                  "Red mulberry" },
/* 092 */ { "MORSPP", "MORSPP",  1, 12,   34, "Morus species",                "Mulberries" },
/* 093 */ { "NYAQ2",  "NYSAQU",  1,  9,    4, "Nyssa aquatica",               "Water tupelo" },
/* 094 */ { "NYOG",   "NYSOGE",  1, 17,    4, "Nyssa ogache",                 "Ogeechee tupelo" },
/* 095 */ { "NYSSPP", "NYSSPP",  1,  4,   34, "Nyssa species",                "Tupelos" },
/* 096 */ { "NYSY",   "NYSSYL",  1, 18,   34, "Nyssa sylvatica",              "Black gum, Black tupelo" },
/* 097 */ { "NYBI",   "NYSSYLB", 1, 16,    4, "Nyssa biflora",                "Swamp tupelo" },
/* 098 */ { "OSVI",   "OSTVIR",  1, 16,   34, "Ostrya virginiana",            "Hophornbeam" },
/* 099 */ { "OXAR",   "OXYARB",  1, 15,   34, "Oxydendrum arboreum",          "Sourwood" },
/* 100 */ { "PATO2",  "PAUTOM",  1, 29,   34, "Paulownia tomentosa",          "Princess tree" },
/* 101 */ { "PEBO",   "PERBOR",  1, 17,    4, "Persea borbonia",              "Redbay" },
/* 102 */ { "PIAB",   "PICABI",  3,  8,   34, "Picea abies",                  "Norway spruce" },
/* 103 */ { "PIEN",   "PICENG", 15, 15,   12, "Picea engelmannii",            "Engelmann spruce" },
/* 104 */ { "PIGL",   "PICGLA",  3,  4,  123, "Picea glauca",                 "White spruce" },
/* 105 */ { "PIMA",   "PICMAR",  3, 11,  234, "Picea mariana",                "Black spruce" },
/* 106 */ { "PIPU",   "PICPUN",  3, 10,    1, "Picea pungens",                "Blue spruce" },
/* 107 */ { "PIRU",   "PICRUB",  3, 13,   34, "Picea rubens",                 "Red spruce" },
/* 108 */ { "PISI",   "PICSIT",  3,  6,    2, "Picea sitchensis",             "Sitka spruce" },
/* 109 */ { "PICSPP", "PICSPP",  3, 13,   34, "Picea species",                "Spruces" },
/* 110 */ { "PIAL",   "PINALB", 17,  9,   12, "Pinus albicaulis",             "Whitebark pine" },
/* 111 */ { "PIAT",   "PINATT",  1,  9,    2, "Pinus attenuata",              "Knobcone pine" },
/* 112 */ { "PIBA2",  "PINBAN",  1, 19,    3, "Pinus banksiana",              "Jack pine" },
/* 113 */ { "PICL",   "PINCLA",  1, 14,    4, "Pinus clausa",                 "Sand pine" },
/* 114 */ { "PICO",   "PINCON", 17,  7,   12, "Pinus contorta",               "Lodgepole pine" },
/* 115 */ { "PIEC2",  "PINECH",  1, 16,   34, "Pinus echinata",               "Shortleaf pine" },
/* 116 */ { "PIEL",   "PINELL",  1, 31,    4, "Pinus elliottii",              "Slash pine" },
/* 117 */ { "PIFL2",  "PINFLE",  1,  9,    1, "Pinus flexilis",               "Limber pine" },
/* 118 */ { "PIGL2",  "PINGLA",  1, 14,    4, "Pinus glabra",                 "Spruce pine" },
/* 119 */ { "PIJE",   "PINJEF", 19, 37,   12, "Pinus jeffreyi",               "Jeffrey pine" },
/* 120 */ { "PILA",   "PINLAM", 18, 38,   12, "Pinus lambertiana",            "Sugar pine" },
/* 121 */ { "PIMO3",  "PINMON",  1, 14,   12, "Pinus monticola",              "Western white pine" },
/* 122 */ { "PIPA2",  "PINPAL",  5, 40,    4, "Pinus palustrus",              "Longleaf pine" },
/* 123 */ { "PIPO",   "PINPON", 19, 36,   12, "Pinus ponderosa",              "Ponderosa pine" },
/* 124 */ { "PIPU5",  "PINPUN",  1, 19,   34, "Pinus pungens",                "Table mountain pine" },
/* 125 */ { "PIRE",   "PINRES",  1, 22,   34, "Pinus resinosa",               "Red pine" },
/* 126 */ { "PIRI",   "PINRIG",  1, 24,   34, "Pinus rigida",                 "Pitch pine" },
/* 127 */ { "PISA2",  "PINSAB",  1, 12,    2, "Pinus sabiniana",              "Gray (Digger) pine" },
/* 128 */ { "PISE",   "PINSER",  1, 35,   34, "Pinus serotina",               "Pond pine" },
/* 129 */ { "PINSPP", "PINSPP",  1,  9,   34, "Pinus species",                "Pines" },
/* 130 */ { "PIST",   "PINSTR",  1, 24,   34, "Pinus strobus",                "Eastern white pine" },
/* 131 */ { "PISY",   "PINSYL",  1,  9,   34, "Pinus sylvestris",             "Scots pine" },
/* 132 */ { "PITA",   "PINTAE",  1, 30,   34, "Pinus taeda",                  "Loblolly pine" },
/* 133 */ { "PIVI2",  "PINVIR",  1, 12,   34, "Pinus virginiana",             "Virginia pine" },
/* 134 */ { "PLOC",   "PLAOCC",  1, 12,   34, "Plantus occidentalis",         "American sycamore" },
/* 135 */ { "POBA2",  "POPBAL",  1, 19,   34, "Populus balsamifera",          "Balsam poplar" },
/* 136 */ { "PODE3",  "POPDEL",  1, 19,   34, "Populus deltoides",            "Eastern cottonwood" },
/* 137 */ { "POGR4",  "POPGRA",  1, 18,   34, "Populus grandidentata",        "Bigtooth aspen" },
/* 138 */ { "POHE4",  "POPHET",  1, 29,   34, "Populus heterophylla",         "Swamp cottonwood" },
/* 139 */ { "POPSPP", "POPSPP",  1, 17,   34, "Populus species",              "Poplars" },
/* 140 */ { "POTR15", "POPTRI",  1, 23,    2, "Populus trichocarpa",          "Black cottonwood" },
/* 141 */ { "PRAM",   "PRUAME",  1, 19,    3, "Prunus americana",             "American plum" },
/* 142 */ { "PREM",   "PRUEMA",  1, 35,    2, "Prunus emarginata",            "Bitter cherry" },
/* 143 */ { "PRPE2",  "PRUDEN",  1, 24,   34, "Prunus pensylvanica",          "Pin cherry" },
/* 144 */ { "PRSE2",  "PRUSER",  1,  9,   34, "Prunus serotina",              "Black cherry" },
/* 145 */ { "",       "PRUSPP",  1, 29,   34, "Prunus species",               "Cherries" },
/* 146 */ { "PRVI",   "PRUVIR",  1, 19,    3, "Prunus virginiana",            "Chokecherry" },
/* 147 */ { "PSME",   "PSEMEN", 20, 36,   12, "Pseudotsuga menziesii",        "Douglas-fir" },
/* 148 */ { "QUAG",   "QUEAGR",  1, 29,    2, "Quercus agrifolia",            "California live oak" },
/* 149 */ { "QUAL",   "QUEALB",  1, 19,   34, "Quercus alba",                 "White oak" },
/* 150 */ { "QUBI",   "QUEBIC",  1, 24,   34, "Quercus bicolor",              "Swamp white oak" },
/* 151 */ { "QUCH2",  "QUECHR",  1,  3,    2, "Quercus chrysolepis",          "Canyon live oak" },
/* 152 */ { "QUOC2",  "QUEOCC",  1, 19,   34, "Quercus coccinea",             "Scarlet oak" },
/* 153 */ { "QUDU",   "QUEDOU",  1, 12,    2, "Quercus douglasii",            "Blue oak" },
/* 154 */ { "QUEL",   "QUEELL",  1, 17,   34, "Quercus ellipsoidalis",        "Northern pin oak" },
/* 155 */ { "QUEN",   "QUEENG",  1, 33,    2, "Quercus engelmannii",          "Engelmann oak" },
/* 156 */ { "QUFA",   "QUEFAL",  1, 23,   34, "Quercus falcata",              "Southern red oak" },
/* 157 */ { "QUGA4",  "QUEGAR",  1,  8,    2, "Quercus garryana",             "Oregon white oak" },
/* 158 */ { "QUIM",   "QUEIMB",  1, 20,   34, "Quercus imbricaria",           "Shingle oak" },
/* 159 */ { "QUIN",   "QUEINC",  1, 17,    4, "Quercus incana",               "Bluejack oak" },
/* 160 */ { "QUKE",   "QUEKEL",  1,  9,    2, "Quercus kellogii",             "Califonia black oak" },
/* 161 */ { "QULA2",  "QUELAE",  1, 16,    4, "Quercus laevis",               "Turkey oak" },
/* 162 */ { "QULA3",  "QUELAU",  1, 15,    4, "Quercus laurifolia",           "Laurel oak" },
/* 163 */ { "QULO",   "QUELOB",  1, 22,    2, "Quercus lobata",               "Valley oak" },
/* 164 */ { "QULY",   "QUELYR",  1, 18,   34, "Quercus lyrata",               "Overcup oak" },
/* 165 */ { "QUMA2",  "QUEMAC",  1, 21,   34, "Quercus macrocarpa",           "Bur oak" },
/* 166 */ { "QUMA3",  "QUEMAR",  1, 16,   34, "Quercus marilandica",          "Blackjack oak" },
/* 167 */ { "QUMI",   "QUEMIC",  1, 25,   34, "Quercus michauxii",            "Swamp chestnut oak" },
/* 168 */ { "QUMU",   "QUEMUE",  1, 21,   34, "Quercus muehlenbergii",        "Chinkapin oak" },
/* 169 */ { "QUNI",   "QUENIG",  1, 15,   34, "Quercus nigra",                "Water oak" },
/* 170 */ { "QUNU",   "QUENUT",  1,  9,    4, "Quercus nuttallii",            "Nuttall oak" },
/* 171 */ { "QUPA2",  "QUEPAL",  1, 20,   34, "Quercus palustris",            "Pin oak" },
/* 172 */ { "QUPH",   "QUEPHE",  1, 20,   34, "Quercus phellos",              "Willow oak" },
/* 173 */ { "QUPR2",  "QUEPRI",  1, 28,   34, "Quercus prinus",               "Chestnut oak" },
/* 174 */ { "QURU",   "QUERUB",  1, 21,   34, "Quercus rubra",                "Northern red oak" },
/* 175 */ { "QUSH",   "QUESHU",  1, 16,   34, "Quercus shumardii",            "Shumard oak" },
/* 176 */ { "QUESPP", "QUESPP",  1, 24,   34, "Quercus species",              "Oaks" },
/* 177 */ { "QUST",   "QUESTE",  1, 23,   34, "Quercus stellata",             "Post oak" },
/* 178 */ { "QUVE",   "QUEVEL",  1, 24,   34, "Quercus velutina",             "Black oak" },
/* 179 */ { "QUVI",   "QUEVIR",  1, 22,    4, "Quercus virginiana",           "Live oak" },
/* 180 */ { "QUWI2",  "QUEWIS",  1, 13,    2, "Quercus wislizenii",           "Interior live oak" },
/* 181 */ { "ROPS",   "ROBPSE",  1, 28,   34, "Robinia pseudoacacia",         "Black locust" },
/* 182 */ { "SABE2",  "SALDIA",  1, 19,    3, "Salix bebbiana",               "Diamond willow" },
/* 183 */ { "SANI",   "SALNIG",  1, 19,   34, "Salix nigra",                  "Black willow" },
/* 184 */ { "SALSPP", "SALSPP",  1, 20,  234, "Salix species",                "Willows" },
/* 185 */ { "SAAL5",  "SASALB",  1, 14,   34, "Sassafras albidum",            "Sassafras" },
/* 186 */ { "SEGI2",  "SEQGIG",  1, 39,    2, "Sequoiadendron gigantea",      "Giant sequoia" },
/* 187 */ { "SESE3",  "SEQSEM",  1, 39,    2, "Sequoia sempervirens",         "Redwood" },
/* 188 */ { "SOAM3",  "SORAME",  1, 19,    3, "Sorbus americana",             "American mountain ash" },
/* 189 */ { "TABR2",  "TAXBRE",  1,  4,   12, "Taxus brevifolia",             "Pacific yew" },
/* 190 */ { "TADI2",  "TAXDIS",  1,  4,   34, "Taxodium distichum",           "Bald cypress" },
/* 191 */ { "TAAS",   "TAXDISN", 1, 21,    4, "Taxodium distictum var. nutans", "Pond cypress" },
/* 192 */ { "THOC2",  "THUOCC",  1,  4,   34, "Thuja occidentalis",           "Northern white cedar" },
/* 193 */ { "THPL",   "THUPLI",  1, 14,   12, "Thuja plicata",                "Western redcedar" },
/* 194 */ { "THUSPP", "THUSPP",  1, 12,   34, "Thuju species",                "Arborvitae" },
/* 195 */ { "TIAM",   "TILAME",  1, 17,   34, "Tilia americana",              "American basswood" },
/* 196 */ { "TIHE",   "TILHET",  1, 29,   34, "Tilia heterophylla",           "White basswood" },
/* 197 */ { "TSCA",   "TSUCAN",  1, 18,   34, "Tsuga canadensis",             "Eastern hemlock" },
/* 198 */ { "TSHE",   "TSUHET",  1, 19,   12, "Tsuga heterophylla",           "Western hemlock" },
/* 199 */ { "TSME",   "TSUMER",  1, 19,   12, "Tsuga mertensiana",            "Mountain hemlock" },
/* 200 */ { "ULAL",   "ULMALA",  1, 10,   34, "Ulmus alata",                  "Winged elm" },
/* 201 */ { "ULAM",   "ULMAME",  1, 10,   34, "Ulmus americana",              "American elm" },
/* 202 */ { "ULPU",   "ULMPUM",  1, 17,   34, "Ulmus pumila",                 "Siberian elm" },
/* 203 */ { "ULRU",   "ULMRUB",  1, 11,   34, "Ulmus rubra",                  "Slippery elm" },
/* 204 */ { "ULMSPP", "ULMSPP",  1, 18,   34, "Ulmus species",                "Elms" },
/* 205 */ { "ULTH",   "ULMTHO",  1, 12,   34, "Ulmus thomasii",               "Rock elm" },
/* 206 */ { "UMCA",   "UMBCAL",  1,  5,    2, "Umbellularia californica",     "California laurel" },

/* 207 */ { "ABLO",    "ABLO",    10, 27,   12, "Abies lowiana",                "Sierra white fir" },
/* 208 */ { "ABNO",    "ABNO",     1, 24,   12, "Abies nobilis",                "Noble fir", },
/* 209 */ { "AEFL",    "AEFL",     1, 29,   34, "Aesculus flava",               "Yellow buckeye" },
/* 210 */ { "CANO9",   "CANO9",    1,  2,    2, "Callitropsis nootkatensis",    "Alaska cedar" },
/* 211 */ { "CADE27",  "CADE27",  12, 34,   12, "Calocedrus decurrens",         "Incense cedar" },
/* 212 */ { "CAAL27",  "CAAL27",   1, 22,   34, "Carya alba",                   "Mockernut hickory" },
/* 213 */ { "CACA38",  "CACA38",   1, 19,   34, "Carya carolinae septentrionalis", "Shagbark hickory" },
/* 214 */ { "CAAM29",  "CAAM29",   1, 19,   34, "Castenea Americana",           "American chestnut" },
/* 215 */ { "CHCHC4",  "CHCHC4",   1, 24,   34, "Chrysolepis chrysophylla",     "Giant chinkapin" },
/* 216 */ { "CUNO",    "CUNO",     1,  2,    2, "Cupressus nootkatensis",       "Nootka cypress" },
/* 217 */ { "CUTH",    "CUTH",     1,  4,    2, "Cupressus thyoides",           "Atlantic white cedar" },
/* 218 */ { "QUTE",    "QUTE",     1,  9,   34, "Quercus texana",               "Texas red oak" },
/* 219 */ { "ULRA",    "ULRA",     1, 12,   34, "Ulmus racemosa",               "Rock elm" },

/* 220 */ {  NULL,      NULL,     0,  0,    0,  NULL,                           NULL }
};

//------------------------------------------------------------------------------
/*! \brief Calculates tree bark thickness using the old BEHAVE equations.
 *
 *  \param speciesIndex Index into the BehaveBarkSpecies[] array.
 *  This value is returned by a call to FBL_BehaveBarkSpeciesIndex().
 *  \param dbh Tree diameter at breast height (in).
 *
 *  \return Tree bark thickness (in).
 */

static double BehaveBark[][2] =
{
    { 0.000, 0.0665 },  // 0 Douglas-fir (BEHAVE code 1)
    { 0.000, 0.0650 },  // 1 western larch (BEHAVE code 1)
    { 0.056, 0.0430 },  // 2 western hemlock (BEHAVE code 2)
    { 0.189, 0.0220 },  // 3 Engelmann spruce (BEHAVE code 3)
    { 0.189, 0.0220 },  // 4 western red cedar (BEHAVE code 3)
    { 0.000, 0.0150 },  // 5 subalpine fir (BEHAVE code 4)
    { 0.000, 0.0150 }   // 6 lodgepole pine (BEHAVE code 4)
} ;

double FBL_TreeBarkThicknessBehave( int speciesIndex, double dbh )
{
    return( ( BehaveBark[ speciesIndex ][0]
            + BehaveBark[ speciesIndex ][1] * 2.54 * dbh ) / 2.54 );
}

//------------------------------------------------------------------------------
/*! \brief Calculates tree bark thickness using the FOFEM 5.0 equations.
 *
 *  \param speciesIndex Index into the FofemSpecies[] array.  This value is
 *  returned by a call to FBL_FofemSpeciesIndex().
 *  \param dbh Tree diameter at breast height (in).
 *
 *  \return Tree bark thickness (in).
 */

// Fofem factors for determining Single Bark Thickness.
// Each FOFEM species has a SBT equation index "barkEq" [1-39] into this array.
static double Fofem_Sbt[] =
{
    /* 00 */    0.000,      // Not used
    /* 01 */    0.019,      // Not used
    /* 02 */    0.022,
    /* 03 */    0.024,
    /* 04 */    0.025,
    /* 05 */    0.026,
    /* 06 */    0.027,
    /* 07 */    0.028,
    /* 08 */    0.029,
    /* 09 */    0.030,
    /* 10 */    0.031,
    /* 11 */    0.032,
    /* 12 */    0.033,
    /* 13 */    0.034,
    /* 14 */    0.035,
    /* 15 */    0.036,
    /* 16 */    0.037,
    /* 17 */    0.038,
    /* 18 */    0.039,
    /* 19 */    0.040,
    /* 20 */    0.041,
    /* 21 */    0.042,
    /* 22 */    0.043,
    /* 23 */    0.044,
    /* 24 */    0.045,
    /* 25 */    0.046,
    /* 26 */    0.047,
    /* 27 */    0.048,
    /* 28 */    0.049,
    /* 29 */    0.050,
    /* 30 */    0.052,
    /* 31 */    0.055,
    /* 32 */    0.057,      // Not used
    /* 33 */    0.059,
    /* 34 */    0.060,
    /* 35 */    0.062,
    /* 36 */    0.063,		// Changed from 0.065 to 0.063 in Build 606
    /* 37 */    0.068,
    /* 38 */    0.072,
    /* 39 */    0.081,
	/* 40 */    0.000,		// Reserved for Pinus plustris (longleaf pine)
};

double FBL_TreeBarkThicknessFofem( int speciesIndex, double dbh )
{
	// In FOFEM 6, longleaf pine (speciesIndex 122) has its own bark thickness formula
	if ( speciesIndex == 122 )
	{
		return ( 0.435 + ( 0.031 * 2.54 * dbh  ) ) / 2.54;
	}
    return( Fofem_Sbt[ FofemSpecies[ speciesIndex ].barkEq ] * dbh );
}

//------------------------------------------------------------------------------
/*! \brief Calculates tree crown volume scorched, tree length scorched,
 *  and tree crown length fraction scorched.
 *
 *  \param treeHt Tree height (ft).
 *  \param crownRatio Tree crown ratio (ft/ft).
 *  \param scorchHt Crown scorch height (ft).
 *  \param crownLengthScorched Address where the calculated crown length (ft)
 *  is stored.  If NULL or 0, no value is returned.
 *  \param crownLengthFractionScorched Address where the calculated crown
 *  length fraction (ft/ft) is stored.  If NULL or 0, no value is returned.
 *
 *  \return Fraction of the crown volume that is scorched (ft3/ft3).
 */

double FBL_TreeCrownScorch( double treeHt, double crownRatio, double scorchHt,
    double *crownLengthScorched, double *crownLengthFractionScorched )
{
    double scorchFrac, scorchVol;
    // Tree crown length (ft) and base height (ft)
    double crownLeng = treeHt * crownRatio;
    double baseHt    = treeHt - crownLeng;
    // Tree crown length scorched (ft)
    double scorchLeng = ( scorchHt <= baseHt )
                        ? ( 0.0 )
                        : ( scorchHt - baseHt );
    scorchLeng = ( scorchLeng > crownLeng )
                 ? ( crownLeng )
                 : ( scorchLeng );
    // Fraction of the crown length scorched (ft/ft)
    if ( crownLeng < SMIDGEN )
    {
        scorchFrac = ( scorchLeng > 0. )
                     ? ( 1.0 )
                     : ( 0.0 );
    }
    else
    {
        scorchFrac = scorchLeng / crownLeng;
    }
    // Fraction of the crown volume scorched (ft3/ft3)
    scorchVol = ( crownLeng < SMIDGEN )
                ? ( 0.0 )
                : ( scorchLeng * ( 2. * crownLeng - scorchLeng )
                    / ( crownLeng * crownLeng ) );
    // Store results in parameter addresses
    if ( crownLengthScorched )
    {
        *crownLengthScorched = scorchLeng;
    }
    if ( crownLengthFractionScorched )
    {
        *crownLengthFractionScorched = scorchFrac;
    }
    return( scorchVol );
}

//------------------------------------------------------------------------------
/*! \brief Calculates probability of tree mortality using the BEHAVE equations.
 *
 *  \param barkThickness Tree bark thickness (in).
 *  \param scorchHt Fire scorch height (ft).
 *  \param crownVolScorched Fraction of the crown volume that is scorched
 *  (ft3/ft3).
 *
 *  Note that if scorch height is zero, mortality is zero.  But once scorch
 *  height exceeds 0.0001 ft, some fire induced mortality will result as
 *  determined by bark thickness and crown volume scorched.
 *
 *  \return Tree mortality probability [0..1].
 */

double FBL_TreeMortalityBehave( double barkThickness, double scorchHt,
    double crownVolScorched )
{
    double mr = 0.;
    if ( scorchHt > 0.0001 )
    {
        // Compute the bark constant bk
        double bk = 1.466 - 4.862 * barkThickness
                  + 1.156 * barkThickness * barkThickness;
        // Determine mortality rate
        mr = 1. / (1. + exp( -( bk + 5.35 * crownVolScorched * crownVolScorched ) ) );
        // Constrain the result to the range [0..1]
        mr = ( mr < 0. )
             ? ( 0. )
             : ( mr );
        mr = ( mr > 1. )
             ? ( 1. )
             : ( mr );
    }
    return( mr );
}

//------------------------------------------------------------------------------
/*! \brief Calculates probability of tree mortality using the FOFEM 5.0
 *  equations for trees with dbh >= 1.
 *
 *  This is only a partial implementation of the FOFEM mortality algorithm.
 *  Specifically, it only implements those cases where the tree dbh >= 1".
 *  It also excludes the FOFEM special case of \e Populus \e tremuloides,
 *  which requires additional inputs (namely, flame height and fire severity).
 *
 *  \param speciesIndex Index into the FofemSpecies[] array.  This value is
 *  returned by a call to FBL_FofemSpeciesIndex().
 *  \param barkThickness Tree bark thickness (in).
 *  \param crownVolScorched Fraction of the crown volume that is scorched
 *  (ft3/ft3).
 *  \param scorchHt Scorch ht (ft)
 *
 *  \return Tree mortality probability [0..1].
 */

double FBL_TreeMortalityFofem( int speciesIndex, double barkThickness,
    double crownVolScorched, double scorchHt )
{
	double mr = 0.0;
    // Pat requested that if scorch ht is zero, then mortality is zero
    if ( scorchHt < 0.0001 )
    {
        return( mr );
    }

	// FOFEM 6 has a separate mortality equation for longleaf pine (speciesIndex == 122)
	if ( speciesIndex == 122 )
	{
		// Convert CVS from fraction to scale 1-10
		double cvs = 10. * crownVolScorched;
		if ( cvs > 0.0001 )
		{
			double bt = 2.54 * barkThickness;
			mr = 0.169
			   + ( 5.136 * bt )
			+ ( 14.492 * bt * bt )
			- ( 0.348 * cvs * cvs );
		}
	}
	// All other species use FOFEM equation 1 for dbh > 1"
	else
	{
		mr = -1.941
           + 6.316 * ( 1.0 - exp( -barkThickness ) )
           - 5.35 * crownVolScorched * crownVolScorched;
	}
    mr = 1.0 / ( 1.0 + exp( mr ) );
    // Apply minimum mortality probability for Picea (FOFEM equation 3).
    if ( FofemSpecies[speciesIndex].mortEq == 3 )
    {
		mr = ( mr < 0.8 ) ? 0.8 : mr;
    }
	// Apply minimum mortality probability for longleaf
	else if ( speciesIndex == 122 )
	{
		mr = ( mr < 0.3 ) ? 0.3 : mr;
	}
    // Confine results to range [0..1].
	mr = ( mr > 1.0 ) ? 1.0 : mr;
	mr = ( mr < 0.0 ) ? 0.0 : mr;
    return( mr );
}

//------------------------------------------------------------------------------
/*! \brief Calculates probability of tree mortality using the Hood 2008 equations.
 *
 *  \param speciesIndex Index into the HoodSpecies[] array [0..9].
 *  \param dbh Tree diameter-at-breast-height (cm).
 *  \param crownLengScorched Fraction of the crown length that is scorched (ft2/ft2).
 *  \param crownVolScorched Fraction of the crown volume that is scorched
 *  (ft3/ft3).
 *
 *  \return Tree mortality probability [0..1].
 */

double FBL_TreeMortalityHood( int speciesIndex, double dbh,
    double crownLengScorched, double crownVolScorched )
{
    double mr  = 0.00;
    // Convert to percents
    double cls = 100. * crownLengScorched;
    double cvs = 100. * crownVolScorched;
	bool zero = false;
    // White fir: crown LENGTH scorched only
	// This is Hood Eq 0, FOFEM v5 Eq 4, and FOFEM v6 Eq 10
	if ( speciesIndex == 0 )
    {
        mr = -3.5083
           + ( 0.0956 * cls )
           - ( 0.00184 * cls * cls )
           + ( 0.000017 * cls * cls * cls );
		zero = ( cls < SMIDGEN );
    }
    // Subaline and grand fir: crown VOLUME scorched only
	// This is Hood Eq 1, FOFEM v5 Eq 8, and FOFEM v6 Eq 11
    else if ( speciesIndex == 1 )
    {
        mr = -1.6950
           + ( 0.2071 * cvs )
           - ( 0.0047 * cvs * cvs )
           + ( 0.000035 * cvs * cvs * cvs );
  		zero = ( cvs < SMIDGEN );
	}
    // Red fir: crown LENGTH scorched only
	// This is Hood Eq 2, FOFEM v5 Eq 5, and FOFEM v6 Eq 16
    else if ( speciesIndex == 2 )
    {
        mr = -2.3085 + 0.000004059 * cls * cls * cls;
 		zero = ( cls < SMIDGEN );
	}
    // Incense cedar: crown LENGTH scorched only
	// This is Hood Eq 3, FOFEM v5 Eq 6, and FOFEM v6 Eq 12
    else if ( speciesIndex == 3 )
    {
        mr = -4.2466 + 0.000007172 * cls * cls * cls;
 		zero = ( cls < SMIDGEN );
	}
    // Western larch: crown VOLUME scorched and DBH
	// This is Hood Eq 4, FOFEM v5 Eq 12, and FOFEM v6 Eq 14
    else if ( speciesIndex == 4 )
    {
        mr = -1.6594
           + ( 0.0327 * cvs )
           - ( 0.0489 * dbh );
 		zero = ( cvs < SMIDGEN );
	}
    // Whitebark and lodgepole pine: crown VOLUME scorched and DBH
	// This is Hood Eq 5, FOFEM v5 Eq 13, and FOFEM v6 Eq 17
    else if ( speciesIndex == 5 )
    {
        mr = -0.3268
           + ( 0.1387 * cvs )
           - ( 0.0033 * cvs * cvs )
           + ( 0.000025 * cvs * cvs * cvs )
           - ( 0.0266 * dbh );
 		zero = ( cvs < SMIDGEN );
	}
    // Engelmann spruce: crown VOLUME scorch only
    // This is Hood Eq 6, FOFEM v5 Eq 9, and FOFEM v6 Eq 15
	else if ( speciesIndex == 6 )
    {
        mr = 0.0845 + ( 0.0445 * cvs );
		zero = ( cvs < SMIDGEN );
    }
    // Sugar pine: crown LENGTH scorch only
	// This is Hood Eq 7, FOFEM v5 Eq 7, and FOFEM v6 Eq 18
    else if ( speciesIndex == 7 )
    {
        mr = -2.0588 + ( 0.000814 * cls * cls );
		zero = ( cls < SMIDGEN );
    }
    // Ponderosa and Jeffrey pine: crown VOLUME scorch only
	// This is Hood Eq 8, FOFEM v5 Eq 10, and FOFEM v6 Eq 19
    else if ( speciesIndex == 8 )
    {
        mr = -2.7103 + ( 0.000004093 * cvs * cvs * cvs );
  		zero = ( cvs < SMIDGEN );
    }
    // Douglas-fir: crown VOLUME scorched
	// This is Hood Eq 9, FOFEM v5 Eq 11, and FOFEM v6 Eq 20
    else if ( speciesIndex == 9 )
    {
        mr = -2.0346
           + ( 0.0906 * cvs )
           - ( 0.0022 * cvs * cvs )
           + ( 0.000019 * cvs * cvs * cvs );
  		zero = ( cvs < SMIDGEN );
	}
    // UNKNOWN SPECIES INDEX
    else
    {
        fprintf( stderr, "FBL_TreeMortalityHood(): speciesIndex %d is outside valid range 0..9.",
            speciesIndex );
        return( 0.0 );
    }
	if ( zero )
	{
		return 0.;
	}
    // All Hood's equations use this form so we do them all here:
    mr = 1. / ( 1. + exp( -mr ) );
    // Confine results to range [0..1].
	mr = ( mr > 1.0 ) ? 1. : mr;
	mr = ( mr < 0.0 ) ? 0. : mr;
    return( mr );
}
