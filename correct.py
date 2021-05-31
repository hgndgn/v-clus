from bs4 import BeautifulSoup
import os

filename = "api/rest/static/index.html"

if not os.path.isfile(filename):
  print("index.html not found. Build first the angular app.")
  quit()

fd = open(filename, "r+")
content = fd.read()
soup = BeautifulSoup(content, "lxml")

css_link_tags = soup.find_all("link")

for tag in css_link_tags:
  attr = tag.attrs["href"]
  tag.attrs["href"] = f"{{{{ url_for('static', filename='{attr}') }}}}"

scripts = soup.find_all("script")

for s in scripts:
  attr = s.attrs["src"]
  result = f"{{{{ url_for('static', filename='{attr}') }}}}"
  s.attrs["src"] = result    

fd.truncate(0)
fd.seek(0)
fd.write(str(soup.prettify()))
fd.close()