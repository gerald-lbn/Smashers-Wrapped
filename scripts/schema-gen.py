import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from os import remove
from os.path import exists

BASE_URL = "https://developer.start.gg"
filename = "schema.graphql"

def make_soup(url: str) -> BeautifulSoup:
  r = requests.get(url)
  soup = BeautifulSoup(r.content, "html.parser")
  return soup


def find_code(soup: BeautifulSoup) -> str:
  ul = soup.find("ul", class_="code")
  content = ""
  for li in ul.find_all("li"):
    content += li.text + "\n"
  return content

def scheme_docs(soup: BeautifulSoup) -> str:
  nav = soup.find("div", id="navication-scroll")
  if (nav is None):
    return []

  links = nav.find_all("a", href=True)
  docs = [link["href"] for link in links if link["href"].endswith(".doc")]
  return docs

# Delete the file if it exists
if exists(filename):
  remove(filename)

initial_soup = make_soup(BASE_URL + "/reference/query.doc.html")
docs = scheme_docs(initial_soup)

file_content = "";

for doc in tqdm(docs):
  soup = make_soup(BASE_URL + doc)
  code = find_code(soup)
  file_content += code + "\n\n"

with open(filename, "w") as ff:
  ff.write(file_content)
  ff.close()
