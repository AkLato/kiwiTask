describe("Cypress Weekend Entry Task", () => {
  it("Task 1", () => {
    // 1. Navštív našu stránku pre BCN letisko v Barcelone.
    cy.visit(
      "https://www.kiwi.com/en/airport/bcn/barcelona-el-prat-barcelona-spain/"
    )
    // get rid of popup
    cy.setCookie("__kwc_agreed", "true")
    cy.reload()

    // 2. Skontroluj, že všetky sekcie a mapa sa zobrazia na stránke.
    const checkedElements = [
      "NavBar",
      "TrendingDestinations",
      "PopularFlights",
      "DestinationsMap",
      "Faq",
      "TopAirlines",
      "StaticFooterMap",
    ]
    checkedElements.forEach((checkedElement) => {
      cy.get(`[data-test="${checkedElement}"]`).should("exist")
    })

    // 3. Skontroluj, že v search form je origin správne nastavený na Barcelona BCN
    cy.contains('[data-test="PlacePickerInputPlace"]', "Barcelona BCN").should(
      "exist"
    )

    // 4. Skontroluj, že H1 element má správny text “Barcelona–El Prat (BCN)”
    cy.get("h1").should("have.text", "Barcelona–El Prat (BCN)")

    // 5. V sekcii “ Popular destinations from Barcelona–El Prat (BCN)” klikni na random picture card.
    cy.get('[data-test="PictureCard"]')
      .its("length")
      .then((numElements) => {
        const randomElIndex = Math.floor(Math.random() * numElements)
        cy.get('[data-test="PictureCard"]').eq(randomElIndex).as("myCard")
        cy.get("@myCard")
          .invoke("attr", "href")
          .then((href) => {
            const myHref = href
            cy.get("@myCard").click()

            // 6. Skontroluj, že si bol/a presmerovaný/á na stránku search/results so správne vyplneným search form
            cy.url().should("include", myHref)
            cy.contains(
              '[data-test="PlacePickerInputPlace"]',
              "Barcelona"
            ).should("exist")
            cy.get('[data-test="PlacePickerInput-destination"]')
              .find('[data-test="PlacePickerInputPlace"]')
              .should("exist")
          })
      })

    // 7. Pridaj vo filtroch jednu príručnú batožinu
    // 8. Presvedč sa, že sa ti načítali nové výsledky.
    cy.intercept("POST", "**/managed-tags/show").as("managedTagsRequest")
    cy.get('[data-test="BagsPopup-cabin"] button').eq(1).click()
    cy.contains("Checking Kiwi.com...").should("be.visible")
    cy.wait("@managedTagsRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })

    // 9. Pokračuj na rezervačný formulár z prvého výsledku (klikni na tlačidlo "Select"/"Rezervovať").
    cy.get('[data-test="BookingButton"]').eq(0).click()

    // 10. Over, že si sa dostal/a na booking stránku (rezervačný formulár).
    const bookingPageElements = [
      "ReservationHead",
      "Reservation-content",
      "ReservationBill-box",
    ]
    cy.get('[data-test="MagicLogin-GuestTextLink"]').click()
    bookingPageElements.forEach((bookingPageElement) => {
      cy.get(`[data-test="${bookingPageElement}"]`).should("exist")
    })
  })
})
