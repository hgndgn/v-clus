from bs4 import BeautifulSoup

filename = "index.html"
fd = open(filename, "r+")
content = fd.read()
soup = BeautifulSoup(content, 'lxml')
scripts = soup.find_all('script')

for s in scripts:
  attr = s.attrs["src"]
  result = "{{ url_for('static', filename='" + attr + "') }}"
  s.attrs["src"] = result    

fd.truncate(0)
fd.seek(0)
fd.write(soup.prettify())
fd.close()