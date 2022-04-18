import React, { useState } from "react"
import { graphql } from "gatsby"

import Image from "../components/image"
import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = props => {
  const { data } = props
  const runewords = data.allRunewordsJson.edges
  const runes = data.allRunesJson.edges

  // // get the list of item types
  // const items = runewords.map(function (runeword) {
  //   return runeword.node.items[0]
  // })
  // var uniqueItems = [...new Set(items)]

  // Create an array that contains all of the rune names along with the checked state
  // Find the index values of the checkState array that has the value of 1
  // Grab the value of those index in the Runes array and push them into a separate array to be searched
  const runesCheckedArray = runes.map(function (node) {
    return [node.node.name, false]
  })
  // What runeword are checked
  let [runeChecked, setRuneChecked] = useState(runesCheckedArray)
  // search inputs
  let [searchValue, setSearchValue] = useState("")
  // number of runes searching
  let [searchRuneCount, setSearchRuneCount] = useState(0)
  // Runewords from checked runes
  let [checkedRunewords, setCheckedRunewords] = useState(runewords)
  // Runewords to display - can be different from checkedRunewords due to searches
  let [displayRunewords, setDisplayRunewords] = useState(runewords)
  // State for the completed runeword checkbox
  let [needCompleteRunewords, setNeedCompleteRunewords] = useState(false)

  const handleCheckbox = (position, rune) => {
    // set the checked state to the opposite for the runes
    runeChecked[position][1] = !runeChecked[position][1]
    setRuneChecked(runeChecked)

    // Check if the rune is checked
    if (runeChecked[position][1]) {
      setSearchRuneCount(searchRuneCount + 1)
      // Push the rune to the array for search
    } else {
      setSearchRuneCount(searchRuneCount - 1)
      // Just keep a simple int state variable to see how many runes are being searched
      if (searchRuneCount - 1 == 0) {
        // if nothing is being checked, set the runewords to all runewords
        setCheckedRunewords(runewords)
        setDisplayRunewords(runewords)

        // Handle search; also why is this not being done when the checked runes are not empty
        if (searchValue != "") {
          searchInput(runewords)
        }
        return
      }
    }

    // go through runeChecked and run the filtering to see which rune are checked and create a separate array for that
    let runeToSearch = runeChecked
      .filter(rune => {
        return rune[1] == true
      })
      .map(rune => {
        return rune[0]
      })

    // Run the filtering for the checked runes
    let filteredRunewords = runewords.filter(runeword => {
      // The required runes for the runeword
      const requiredRunes = runeword.node.runes

      // if the runeword needs to be complete
      if (needCompleteRunewords) {
        return requiredRunes.every(rune => runeToSearch.includes(rune))
      }
      // check to see if it at least requires some of the runes
      return runeToSearch.some(rune => requiredRunes.indexOf(rune) >= 0)
    })

    // set the runewords resulting from checked runes
    setCheckedRunewords(filteredRunewords)
    // set the runewords to be displayed after applying search
    setDisplayRunewords(filteredRunewords)

    if (searchValue != "") {
      searchInput(filteredRunewords)
    }
  }

  const handleInputChange = event => {
    setSearchValue(event.target.value)
    // reset the display if there is nothing being searched
    if (event.target.value == "") {
      setDisplayRunewords(checkedRunewords)
    }
  }

  const searchInput = runewordsToSearch => {
    let filteredRunewords = runewordsToSearch.filter(runeword => {
      let { name, items, stats } = runeword.node
      return (
        (name &&
          name.join("").toLowerCase().includes(searchValue.toLowerCase())) ||
        (items &&
          items.join("").toLowerCase().includes(searchValue.toLowerCase())) ||
        (stats &&
          stats.join("").toLowerCase().includes(searchValue.toLowerCase()))
      )
    })
    setDisplayRunewords(filteredRunewords)
  }

  const handleRunewordCheckbox = () => {
    // set the requirement for completed runewords
    setNeedCompleteRunewords(!needCompleteRunewords)
  }

  const handleSearch = event => {
    let runewordsToSearch =
      checkedRunewords.length > 0 ? checkedRunewords : runewords
    searchInput(runewordsToSearch)
    event.preventDefault()
  }

  const getStats = (statList, type) => {
    const listItems = statList.map((statLine, i) => {
      if (statLine != "") return <li key={`${type}-${i}`}>{statLine}</li>
    })
    return <ul>{listItems}</ul>
  }

  return (
    <Layout>
      <Seo title="Home" />

      {/* RUNEWORD CHECKBOXES */}
      <h1 className="text-center section-header">Runes</h1>
      <p className="text-center section-subheader">(select the ones you own)</p>
      <div className="runes-wrapper">
        {runes.map((rune, index) => {
          return (
            <div key={index} className="rune-container">
              <input
                type="checkbox"
                id={`rune-checkbox-${index}`}
                name={rune.node.name}
                value={rune.node.name}
                checked={runeChecked[index][1]}
                onChange={() => handleCheckbox(index, rune.node.name)}
              />

              <label htmlFor={`rune-checkbox-${index}`}>
                <Image
                  src={`runes/${rune.node.name}.png`}
                  className="rune-image"
                  alt={rune.node.name}
                />
                {rune.node.name}
              </label>
            </div>
          )
        })}
      </div>

      <h1 className="text-center  section-header">Possible Runewords</h1>
      {/* SEARCH FIELD */}
      <div className="form-wrapper">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-field"
            type="search"
            placeholder="Search Runeword, Item, or Stat"
            aria-label="Search Runeword, Item, or Stat"
            onChange={handleInputChange}
            value={searchValue}
          />
          <button
            className="btn btn-search"
            type="submit"
            onChange={handleSearch}
          >
            Search
          </button>
        </form>
        <div className="complete-runeword-container">
          <input
            type="checkbox"
            name="complete-runeword"
            value="Complete Runeword"
            checked={needCompleteRunewords}
            onChange={() => handleRunewordCheckbox()}
          />
          <label htmlFor="complete-runeword">Completed Runewords Only</label>
        </div>
      </div>

      {/* RUNEWORD LIST */}
      <div className="runewords-wrapper">
        {displayRunewords
          ? // Apply filter here to check the second index of runeword.node.name matches anything in the array
            displayRunewords.map((runeword, i) => {
              return (
                <div
                  key={`runeword-container-${i}`}
                  className="runeword-container"
                >
                  <h1 key={`name-${i}`}>{runeword.node.name[0]}</h1>{" "}
                  <div className="runeword-runes">
                    {getStats(runeword.node.runes, "rune")}
                  </div>
                  <div className="runeword-items">
                    {getStats(runeword.node.items, "item")}
                  </div>
                  <div className="runeword-level">
                    <p>Required Level {runeword.node.level}</p>{" "}
                  </div>
                  <div className="runeword-stats">
                    {getStats(runeword.node.stats, "stat")}
                  </div>
                </div>
              )
            })
          : "Loading..."}
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allRunewordsJson {
      edges {
        node {
          name
          level
          items
          stats
          runes
        }
      }
    }
    allRunesJson {
      edges {
        node {
          name
        }
      }
    }
  }
`
