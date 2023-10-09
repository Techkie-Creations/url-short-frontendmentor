const menu = document.querySelector('.menu')
const navBar = document.querySelector('.desk-nav')

menu.addEventListener('click', () => {
    navBar.classList.toggle('active')
})


let data
let urls = []

function clicker(val1, val2) {
    const input = document.getElementById(val1)
    const btn = document.getElementById(val2)
    navigator.clipboard.writeText(input.innerHTML).then(() => {
        console.log('Content copied to clipboard');
      },() => {
        console.error('Failed to copy');
      });
    btn.disabled = true;
    btn.innerHTML = 'COPIED!'
    btn.style.backgroundColor = 'hsl(257, 27%, 26%)'
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = 'Copy Text';
        btn.style.backgroundColor = 'hsl(180, 66%, 49%)'
    }, 3000)
}

class Links extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            msg: '',
            status: ''
        }
    }

    handleChange = (e) => {
        this.setState({ input: e.target.value})
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const pattern = new RegExp(
            '^(https?:\\/\\/)' + // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
              '(\\#[-a-z\\d_]*)?$', // fragment locator
            'i'
          );
        if (pattern.test(this.state.input)) {
            const len = localStorage.length + 1
            await fetch(`https://api.shrtco.de/v2/shorten?url=${this.state.input}`)
            .then(response => response.json())
            .then(json => {
                data = json
            })
            
            let keys = Object.keys(localStorage)

            for (let i = 0; i < keys.length; i++) {
                urls.push(JSON.parse(localStorage[keys[i]]))
            }
            let found = urls.filter(elem => elem.originalUrl == this.state.input)
            if (found.length > 0) {
                this.setState({msg: 'URL Already Exists!', status: 'warning'})
                
            } else {
                let url = {
                    originalUrl: this.state.input,
                    shortUrl: data.result.short_link
                }
                localStorage.setItem(`url${len}`, JSON.stringify(url))
                this.setState({ input: '', msg: '', status: '' });
            }
            
        } else {
            this.setState({msg: 'Invalid URL!', status: 'invalid'});
        }

        setTimeout(() => {
            this.setState({msg: '', status: ''})
        }, 3000)
    }
    render() {
        urls = []
        let key = Object.keys(localStorage)
        key.sort()

        for (let i = 0; i < key.length; i++) {
            urls.push(JSON.parse(localStorage[key[i]]))
        }
        const li = urls.map((elem, i) => `<div class="clip">
        <span>${elem.originalUrl}</span>
        <div class="link-line"></div>
        <div class="adj">
          <p id="text${i}">${elem.shortUrl}</p>
          <button onclick="clicker('text${i}', 'btn${i}')" id="btn${i}">Copy Text</button>
        </div>
      </div>`)

      document.getElementById('link-li').innerHTML = li
        
        return (
            <div className='in'>
                <div className='form'>
                    <form onSubmit={this.handleSubmit.bind(this)} method='post'>
                        <div className="inner-form">
                        <input className={this.state.status} onChange={this.handleChange.bind(this)} type="text" placeholder='Shorten a link here...' id="inp" name="url" value={this.state.input} />
                        <p className={`${this.state.status}-text`}>{this.state.msg}</p>
                        </div>
                        <button type="submit">Shorten It!</button>
                    </form>
                    
                </div>
                
            </div>

        )
    }
}

ReactDOM.render(<Links />, document.getElementById('shorten'))

