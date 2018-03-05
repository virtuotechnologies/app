//
//  ViewController.swift
//  HonoluluArt
//
//  Created by soma gorinta on 7/27/17.
//  Copyright © 2017 soma gorinta. All rights reserved.
//

import UIKit
import MapKit


class ViewController: UIViewController {
    
    var artworks = [Artwork]()

    let regionRadius: CLLocationDistance = 1000

    @IBOutlet weak var mapView: MKMapView!
    
   
    override func viewDidLoad() {
               super.viewDidLoad()
        //Here the location which you want to see on map after it loads is going to be initialised change latitude and longitude to load from different location
        
        let initialLocation = CLLocation(latitude: 21.282778, longitude: -157.829444)
        centerMapOnLocation(location: initialLocation)
        
        loadInitialData()
        mapView.addAnnotations(artworks)
        
        mapView.delegate = self
        
        // show single artwork on map; comment out when loading PublicArt.json
            let artwork = Artwork(title: "King David Kalakaua", locationName: "Waikiki Gateway Park",
              discipline: "Sculpture", coordinate: CLLocationCoordinate2D(latitude: 21.283921,
                longitude: -157.831661))
            mapView.addAnnotation(artwork)
        
    }
    
    func loadInitialData() {
        // 1
        let fileName = Bundle.main.path(forResource: "PublicArt", ofType: "json");
        var data: Data?
        do {
            data = try Data(contentsOf: URL(fileURLWithPath: fileName!), options: NSData.ReadingOptions(rawValue: 0))
        } catch _ {
            data = nil
        }
        
        
        // 2
        var jsonObject: Any? = nil
        if let data = data {
            do {
                jsonObject = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions(rawValue: 0))
            } catch _ {
                jsonObject = nil
            }
        }
        
        // 3
        if let jsonObject = jsonObject as? [String: Any],
            // 4
            let jsonData = JSONValue.fromObject(object: jsonObject as AnyObject)?["data"]?.array {
            for artworkJSON in jsonData {
                if let artworkJSON = artworkJSON.array,
                    // 5
                    let artwork = Artwork.fromJSON(json: artworkJSON) {
                    artworks.append(artwork)
                }
            }
        }
    }
    
    func centerMapOnLocation(location: CLLocation){
        let CoordinateRegion = MKCoordinateRegionMakeWithDistance(location.coordinate, regionRadius * 2.0, regionRadius * 2.0)
        mapView.setRegion(CoordinateRegion, animated: true)
    }
    
    var locationManager = CLLocationManager()
    func checkLocationAuthorizationStatus() {
        if CLLocationManager.authorizationStatus() == .authorizedWhenInUse {
            mapView.showsUserLocation = true
        } else {
            locationManager.requestWhenInUseAuthorization()
        }
    }
    
    func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        checkLocationAuthorizationStatus()
    }
   
}

        // Do any additional setup after loading the view, typically from a nib.


//    override func didReceiveMemoryWarning() {
//        super.didReceiveMemoryWarning()
//        // Dispose of any resources that can be recreated.
//    }
//


