package views

// Lang is the UI language. Everything the templates say goes through t(), so
// adding a language is adding a column here. Article bodies are not translated:
// they stay in the language they were written in (each carries its own lang).
type Lang string

const (
	EN Lang = "en"
	PT Lang = "pt-BR"
)

// Parse maps anything to a supported Lang. Default is English.
func Parse(s string) Lang {
	if len(s) >= 2 && (s[:2] == "pt" || s[:2] == "PT") {
		return PT
	}
	return EN
}

// Other is the language the toggle offers.
func (l Lang) Other() Lang {
	if l == PT {
		return EN
	}
	return PT
}

func (l Lang) idx() int {
	if l == PT {
		return 1
	}
	return 0
}

// t looks a key up; a missing key renders as the key so it is obvious in the page.
func t(l Lang, key string) string {
	if v, ok := tr[key]; ok {
		return v[l.idx()]
	}
	return "[" + key + "]"
}

// pick chooses from an inline {en, pt} pair, for data tables.
func pick(l Lang, s [2]string) string { return s[l.idx()] }

var tr = map[string][2]string{
	// layout
	"meta.desc":  {"Guilherme Barradas. AI quality engineer. I break models before you do.", "Guilherme Barradas. Engenheiro de qualidade de IA. Eu quebro modelos antes de você."},
	"title.home": {"hello, human", "olá, humano"},

	// hotbar
	"nav.aria":       {"Sections", "Seções"},
	"nav.home":       {"home", "início"},
	"nav.about":      {"about", "sobre"},
	"nav.skills":     {"skills", "skills"},
	"nav.projects":   {"projects", "projetos"},
	"nav.work":       {"work", "trabalho"},
	"nav.contact":    {"contact", "contato"},
	"nav.articles":   {"articles", "artigos"},
	"nav.debug":      {"debug", "debug"},
	"nav.radio":      {"radio", "rádio"},
	"nav.radioTitle": {"radio: everyone hears the same thing", "rádio: todo mundo ouve a mesma coisa"},
	"nav.egg":        {"don't click", "não clica"},
	"nav.eggTitle":   {"seriously, don't", "sério, não"},
	"nav.lang":       {"português", "english"},
	"nav.langIcon":   {"PT", "EN"},
	"nav.langTitle":  {"ler em português", "read in English"},

	// hero
	"hero.kicker":  {"guilherme barradas · rio de janeiro", "guilherme barradas · rio de janeiro"},
	"hero.h1a":     {"I break models", "Eu quebro modelos"},
	"hero.h1b":     {"before you do.", "antes de você."},
	"hero.sub":     {"AI quality engineer. Four years across backend, blockchain and evaluation of AI systems. Now I spend my days judging whether code is actually right, not just whether it runs.", "Engenheiro de qualidade de IA. Quatro anos entre backend, blockchain e avaliação de sistemas de IA. Hoje passo os dias julgando se o código está certo de verdade, não só se ele roda."},
	"hero.cta":     {"See projects", "Ver projetos"},
	"hero.cv":      {"Download CV", "Baixar CV"},
	"hero.avatar":  {"Pixel avatar of Guilherme. Click to hit.", "Avatar pixel art do Guilherme. Clique pra bater."},
	"hero.hp":      {"Health: 100 of 100", "Vida: 100 de 100"},
	"hero.lvl":     {"lvl 24", "lvl 24"},
	"net.title":    {"a real 2-4-4-1 mlp learning xor in your browser. click to reset the weights.", "uma mlp 2-4-4-1 de verdade aprendendo xor no seu navegador. clique pra zerar os pesos."},
	"net.aria":     {"Live neural network learning XOR", "Rede neural ao vivo aprendendo XOR"},
	"net.warmup":   {"xor · warming up", "xor · aquecendo"},
	"splash.title": {"click for another", "clique pra outra"},

	// sections
	"about.h":    {"About", "Sobre"},
	"about.p1":   {"I've duelled an alligator, taken a photo with Ronaldinho and scored at Maracanã. My mission is to destroy the world, but that's a secret, okay?", "Já duelei com um jacaré, tirei foto com o Ronaldinho e fiz gol no Maracanã. Minha missão é destruir o mundo, mas isso é segredo, tá?"},
	"about.p2":   {"Started coding because of Minecraft. Still here. I care about the same question in every role: how do we know this works?", "Comecei a programar por causa do Minecraft. Continuo aqui. Em todo cargo me importo com a mesma pergunta: como a gente sabe que isso funciona?"},
	"inv.h":      {"Inventory", "Inventário"},
	"projects.h": {"Projects", "Projetos"},
	"gs.bubble":  {"Go check GitShelters and survive the 404!", "Confere o GitShelters e sobrevive ao 404!"},
	"gs.kicker":  {"new · public alpha", "novo · alpha público"},
	"gs.blurb":   {"An idle base-builder where your real GitHub pushes become Bytes that build a post-apocalyptic bunker. Your Forks work while you're away, get bitter when you stop committing, and every bunker is a dot on the map of the 404 Lands.", "Um idle base-builder onde seus pushes reais no GitHub viram Bytes que constroem um bunker pós-apocalíptico. Seus Forks trabalham enquanto você está fora, ficam amargos quando você para de commitar, e todo bunker é um ponto no mapa das 404 Lands."},
	"work.h":     {"Work", "Trabalho"},
	"contact.h":  {"Contact", "Contato"},
	"contact.p":  {"Open to remote roles with US and European teams.", "Aberto a vagas remotas com times dos EUA e da Europa."},
	"foot":       {"© 2026 faalldev. Nothing is created, everything is copied.", "© 2026 faalldev. Nada se cria, tudo se copia."},

	// death screen
	"death.h":     {"You died!", "Você morreu!"},
	"death.by":    {"guilherme was slain by a visitor", "guilherme foi morto por um visitante"},
	"death.score": {"Score:", "Pontuação:"},
	"death.resp":  {"Respawn", "Renascer"},
	"death.title": {"Title screen", "Tela inicial"},

	// radio bar
	"radio.aria":  {"Radio player", "Rádio"},
	"radio.prev":  {"previous track", "faixa anterior"},
	"radio.pause": {"pause", "pausar"},
	"radio.next":  {"next track", "próxima faixa"},
	"radio.vol":   {"vol", "vol"},
	"radio.volA":  {"Radio volume", "Volume do rádio"},

	// egg
	"egg.title": {"minecraft classic · 2009 · served by mojang", "minecraft classic · 2009 · servido pela mojang"},
	"egg.close": {"close (esc)", "fechar (esc)"},
	"egg.hint":  {"loading classic.minecraft.net…", "carregando classic.minecraft.net…"},
	"egg.foot":  {"told you not to click. this is the real 2009 build, straight from mojang, in your browser. wasd to move, mouse to look, click to place and break. esc or x closes.", "eu avisei pra não clicar. esse é o build real de 2009, direto da mojang, no seu navegador. wasd pra andar, mouse pra olhar, clique pra colocar e quebrar. esc ou x fecha."},

	// doors
	"door.articles": {"Articles ->", "Artigos ->"},
	"door.artAria":  {"Articles", "Artigos"},
	"door.home":     {"<- home", "<- início"},
	"door.homeAria": {"Back home", "Voltar ao início"},

	// articles
	"art.title":  {"articles · faalldev", "artigos · faalldev"},
	"art.kicker": {"guilherme barradas · writing", "guilherme barradas · escrita"},
	"art.h":      {"Articles", "Artigos"},
	"art.sub":    {"Short pieces on testing, evaluation and the craft. Written in Portuguese for now; your browser can translate them.", "Textos curtos sobre testes, avaliação e o ofício. Escritos em português, por enquanto."},
	"art.read":   {"read here ->", "ler aqui ->"},
	"art.crumb":  {"articles", "artigos"},
	"art.min":    {"min read", "min de leitura"},
	"art.badge":  {"published on %s. like, comment or share it there ->", "publicado no %s. curta, comente ou compartilhe lá ->"},
}
