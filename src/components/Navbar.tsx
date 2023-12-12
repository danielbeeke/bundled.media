const Navbar = (title: string, links: Array<{ path: string, title: string }>, route: any) => {

  return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand ms-4" href="/">
      <img src="/logo.svg" style="height: 50px" />
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ml-auto">
        ${links.map(({ path, title }) => `
            <li class="nav-item">
                <a class="nav-link ${route.path === path ? 'active' : ''}" href="${path}">${title}</a>
            </li>
        `).join('')}
    </ul>
    </div>
    </nav>
  `


}

export default Navbar