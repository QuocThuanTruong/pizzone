function helper(hbs) {
    hbs.registerHelper('renderHeaderMenu', (active) => {
        let html = '<ul className="header-menu">';
        let home = '<li><a href="/">Home</a></li>';
        let about = '<li><a href="/about">About</a></li>';
        let menu = '<li><a href="/dishes">Menu</a></li>';
        let blog = '<li><a href="/dishes">Blog</a></li>';
        let contact = '<li><a href="/dishes">Contact</a></li>';

        if (active === 'home') {
            home = '<li class="active"><a href="/">Home</a></li>';
        } else if (active === 'about') {
            about = '<li class="active"><a href="/about">About</a></li>';
        } else if (active === 'menu') {
            menu = '<li class="active"><a href="/dishes">Menu</a></li>';
        } else if (active === 'blog') {
            blog = '<li class="active"><a href="/dishes">Blog</a></li>';
        } else if (active === 'contact') {
            contact = '<li class="active"><a href="/dishes">Contact</a></li>';
        }

        html += home;
        html += about;
        html += menu;
        html += blog;
        html += contact;
        html += '</ul>';

        return new hbs.SafeString(html)
    });
}

module.exports = helper;