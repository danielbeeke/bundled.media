
const NavBar = (title: string, links: string[]) => {
  const BASEURL = 'http://localhost:8080/'
  return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href=${BASEURL}>${title}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ml-auto">
        ${links.map(link => `
            <li class="nav-item">
                <a class="nav-link" href=${BASEURL}/${link}>${link}</a>
            </li>
        `).join('')}
    </ul>
    </div>
    </nav>
  `


}

export default NavBar