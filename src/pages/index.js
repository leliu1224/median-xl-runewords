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

  let [searchValue, setSearchValue] = useState("")
  // What runeword are checked
  let [runeChecked, setRuneChecked] = useState(runesCheckedArray)
  // Array or runes to search for
  let [searchArray, setSearchArray] = useState([])
  // Runewords from checked runes
  let [checkedRunewords, setCheckedRunewords] = useState(runewords)
  // Runewords to display
  let [displayRunewords, setDisplayRunewords] = useState(runewords)
  //
  let [needCompleteRunewords, setNeedCompleteRunewords] = useState(false)

  const handleCheckbox = (position, rune) => {
    // get full rune array with condition set to true for checked runes
    runeChecked[position][1] = !runeChecked[position][1]
    // let updatedRuneChecked = runeChecked.map((runeItem, index) =>
    //   index === position
    //     ? [runeItem[0], !runeItem[1]]
    //     : [runeItem[0], runeItem[1]]
    // )
    // setRuneChecked(updatedRuneChecked)
    setRuneChecked(runeChecked)

    // Remove the item if the state is false
    // Check if the index

    // Create an array for the runes being searched
    let updatedSearchArray = searchArray

    // Check if the rune is checked
    if (runeChecked[position][1]) {
      // Push the rune to the array for search
      updatedSearchArray.push(rune)

      // updatedSearchArray = updatedSearchArray.filter(function (item, pos) {
      //   var test = item
      //   var test2 = updatedSearchArray.indexOf(item)
      //   return updatedSearchArray.indexOf(item) == pos
      // })
      // console.log(updatedSearchArray)
      // Clean up the array to unique values
      // Set the search array state
      setSearchArray(updatedSearchArray)
    } else {
      // Remove the rune from the search array
      updatedSearchArray.splice(updatedSearchArray.indexOf(rune), 1)
      // console.log(updatedSearchArray)
      setSearchArray(updatedSearchArray)
      if (updatedSearchArray.length == 0) {
        setCheckedRunewords(runewords)
        setDisplayRunewords(runewords)
        if (searchValue != "") {
          filteredRunewords = runewords.filter(runeword => {
            let { name, items, stats } = runeword.node
            // console.log(name)
            // console.log(items)
            // console.log(stats)
            return (
              (name &&
                name
                  .join("")
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())) ||
              (items &&
                items
                  .join("")
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())) ||
              (stats &&
                stats
                  .join("")
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()))
            )
          })
          setDisplayRunewords(filteredRunewords)
        }
        return
      }
    }

    // console.log(runeChecked[0])
    // let tempRunewords = runewords
    // let filteredRunewords =
    //   searchRunewords.length > 0 ? searchRunewords : runewords

    // if (updatedSearchArray.length > 0) {
    // loop through all the runewords
    let filteredRunewords = runewords.filter(runeword => {
      // get the required runes
      const requiredRunes = runeword.node.runes
      // console.log(requiredRunewords)
      // check if the
      // check to see if it at least requires some of the runes
      if (needCompleteRunewords) {
        return requiredRunes.every(rune => updatedSearchArray.includes(rune))
      }
      return updatedSearchArray.some(rune => requiredRunes.indexOf(rune) >= 0)
    })

    // filteredRuneword =
    //   filteredRuneword.length > 0 ? filteredRuneword : runewords

    setCheckedRunewords(filteredRunewords)
    setDisplayRunewords(filteredRunewords)

    if (searchValue != "") {
      filteredRunewords = filteredRunewords.filter(runeword => {
        let { name, items, stats } = runeword.node
        // console.log(name)
        // console.log(items)
        // console.log(stats)
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
  }

  const handleInputChange = event => {
    setSearchValue(event.target.value)
    if (event.target.value == "") {
      setDisplayRunewords(checkedRunewords)
    }
  }

  const searchInput = () => {
    // let query = searchValue
    let filteredRunewords =
      checkedRunewords.length > 0 ? checkedRunewords : runewords

    filteredRunewords = filteredRunewords.filter(runeword => {
      let { name, items, stats } = runeword.node
      // console.log(name)
      // console.log(items)
      // console.log(stats)
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
    console.log(needCompleteRunewords)
    setNeedCompleteRunewords(!needCompleteRunewords)
  }

  const handleSearch = event => {
    searchInput()
    event.preventDefault()
    // let hasSearchResults = searchRunewords.length > 0 && searchValue !== ""
    // let filteredRunewords = hasSearchResults ? searchRunewords : runewords
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
